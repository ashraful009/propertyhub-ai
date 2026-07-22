const mongoose = require('mongoose');
const { aggregateCommissions, findCompanyByIdAndSelect } = require('./commission.repository');
const generateReportPDF = require('../../../utils/generateReportPDF');
const { ValidationError } = require('../../../errors');

const _startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const _endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const buildDateFilter = ({ filter_type, start_date, end_date } = {}) => {
  const now = new Date();
  switch (filter_type) {
    case 'today':
      return { createdAt: { $gte: _startOfDay(now), $lte: _endOfDay(now) } };
    case 'this_week': {
      const dow = now.getDay();
      const diff = dow === 0 ? -6 : 1 - dow;
      const mon = new Date(now);
      mon.setDate(now.getDate() + diff);
      return { createdAt: { $gte: _startOfDay(mon), $lte: _endOfDay(now) } };
    }
    case 'this_month':
      return {
        createdAt: {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lte: _endOfDay(now),
        },
      };
    case 'this_year':
      return {
        createdAt: {
          $gte: new Date(now.getFullYear(), 0, 1),
          $lte: _endOfDay(now),
        },
      };
    case 'custom': {
      if (!start_date || !end_date) {
        throw new ValidationError('start_date and end_date are required for a custom date range.');
      }
      const s = _startOfDay(new Date(start_date));
      const e = _endOfDay(new Date(end_date));
      if (isNaN(s) || isNaN(e)) throw new ValidationError('Invalid date format.');
      if (s > e) throw new ValidationError('start_date must be before end_date.');
      return { createdAt: { $gte: s, $lte: e } };
    }
    default:
      return {};
  }
};

const buildDateLabel = ({ filter_type, start_date, end_date } = {}) => {
  const now = new Date();
  const fmt = (d) => d.toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' });
  switch (filter_type) {
    case 'today': return `Today — ${fmt(now)}`;
    case 'this_week': {
      const dow = now.getDay();
      const diff = dow === 0 ? -6 : 1 - dow;
      const mon = new Date(now);
      mon.setDate(now.getDate() + diff);
      return `${fmt(mon)} – ${fmt(now)}`;
    }
    case 'this_month': return `${fmt(new Date(now.getFullYear(), now.getMonth(), 1))} – ${fmt(now)}`;
    case 'this_year': return `${fmt(new Date(now.getFullYear(), 0, 1))} – ${fmt(now)}`;
    case 'custom': return `${fmt(new Date(start_date))} – ${fmt(new Date(end_date))}`;
    default: return 'All Time';
  }
};

const buildShortPeriodLabel = ({ filter_type, start_date, end_date } = {}) => {
  const now = new Date();
  switch (filter_type) {
    case 'today': return 'Today';
    case 'this_week': return 'This Week';
    case 'this_month': return now.toLocaleDateString('en-BD', { month: 'short', year: 'numeric' });
    case 'this_year': return String(now.getFullYear());
    case 'custom': {
      const s = new Date(start_date).toLocaleDateString('en-BD', { day: '2-digit', month: 'short' });
      const e = new Date(end_date).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' });
      return `${s}–${e}`;
    }
    default: return 'All Time';
  }
};

const buildMatchStageFromQuery = (query = {}) => {
  const dateFilter = buildDateFilter(query);
  return { ...dateFilter };
};

const getPlatformOverviewService = async (query) => {
  const matchStage = buildMatchStageFromQuery(query);
  const pipeline = [
    ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
    {
      $group: {
        _id: null,
        totalCommission: { $sum: '$commissionAmount' },
        totalSalesVolume: { $sum: '$totalPrice' },
        totalBookings: { $sum: 1 },
      },
    },
  ];
  const result = await aggregateCommissions(pipeline);
  return result[0] || { totalCommission: 0, totalSalesVolume: 0, totalBookings: 0 };
};

const getCompanyBreakdownService = async (query) => {
  const matchStage = buildMatchStageFromQuery(query);
  const pipeline = [
    ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
    {
      $group: {
        _id: '$companyId',
        totalCommission: { $sum: '$commissionAmount' },
        totalSalesVolume: { $sum: '$totalPrice' },
        totalBookings: { $sum: 1 },
      },
    },
    { $lookup: { from: 'companies', localField: '_id', foreignField: '_id', as: 'company' } },
    { $unwind: '$company' },
    {
      $project: {
        _id: 1,
        companyName: '$company.name',
        companyEmail: '$company.email',
        totalCommission: 1,
        totalSalesVolume: 1,
        totalBookings: 1,
      },
    },
    { $sort: { totalCommission: -1 } },
  ];
  return aggregateCommissions(pipeline);
};

const getPropertyBreakdownService = async (companyId) => {
  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new ValidationError('Invalid company ID');
  }

  const pipeline = [
    { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
    {
      $group: {
        _id: '$propertyId',
        category: { $first: '$category' },
        commissionPercentage: { $first: '$commissionPercentage' },
        totalCommission: { $sum: '$commissionAmount' },
        totalSalesVolume: { $sum: '$totalPrice' },
        bookingCount: { $sum: 1 },
      },
    },
    { $lookup: { from: 'properties', localField: '_id', foreignField: '_id', as: 'property' } },
    { $unwind: '$property' },
    {
      $project: {
        _id: 1,
        propertyTitle: '$property.title',
        category: 1,
        commissionPercentage: 1,
        totalCommission: 1,
        totalSalesVolume: 1,
        bookingCount: 1,
      },
    },
    { $sort: { totalCommission: -1 } },
  ];

  return aggregateCommissions(pipeline);
};

const getMarginReportPDFService = async (query) => {
  const { filter_type, start_date, end_date, company_id } = query;
  const matchStage = buildDateFilter({ filter_type, start_date, end_date });
  let filteredCompanyName = null;

  if (company_id) {
    if (!mongoose.Types.ObjectId.isValid(company_id)) {
      throw new ValidationError('Invalid company_id.');
    }
    matchStage.companyId = new mongoose.Types.ObjectId(company_id);
    const co = await findCompanyByIdAndSelect(company_id, 'name');
    filteredCompanyName = co?.name ?? null;
  }

  const matchArr = Object.keys(matchStage).length ? [{ $match: matchStage }] : [];
  const dateLabel = buildDateLabel({ filter_type, start_date, end_date });
  const shortLabel = buildShortPeriodLabel({ filter_type, start_date, end_date });
  const fmt = (n) => `BDT ${Number(n || 0).toLocaleString('en-US')}`;

  const [overviewResult, companies] = await Promise.all([
    aggregateCommissions([
      ...matchArr,
      {
        $group: {
          _id: null,
          totalCommission: { $sum: '$commissionAmount' },
          totalSalesVolume: { $sum: '$totalPrice' },
          totalBookings: { $sum: 1 },
        },
      },
    ]),
    aggregateCommissions([
      ...matchArr,
      {
        $group: {
          _id: '$companyId',
          totalCommission: { $sum: '$commissionAmount' },
          totalSalesVolume: { $sum: '$totalPrice' },
          totalBookings: { $sum: 1 },
          propertyIds: { $addToSet: '$propertyId' },
        },
      },
      { $lookup: { from: 'companies', localField: '_id', foreignField: '_id', as: 'company' } },
      { $unwind: '$company' },
      {
        $project: {
          companyName: '$company.name',
          totalCommission: 1,
          totalSalesVolume: 1,
          totalBookings: 1,
          totalPropertiesSold: { $size: '$propertyIds' },
        },
      },
      { $sort: { totalCommission: -1 } },
    ]),
  ]);

  const overview = overviewResult[0] || { totalCommission: 0, totalSalesVolume: 0, totalBookings: 0 };
  const netVendorRevenue = (overview.totalSalesVolume || 0) - (overview.totalCommission || 0);

  const rows = companies.map((c, i) => [
    i + 1,
    c.companyName || '—',
    c.totalPropertiesSold ?? 0,
    fmt(c.totalSalesVolume),
    fmt(c.totalCommission),
    fmt((c.totalSalesVolume || 0) - (c.totalCommission || 0)),
    shortLabel,
  ]);

  const pdfBuffer = await generateReportPDF({
    title: 'Platform Revenue & Margin Report',
    subtitle: filteredCompanyName
      ? `Company: ${filteredCompanyName}`
      : 'Super Admin — Platform-Wide Commission Breakdown',
    dateRange: dateLabel,
    summaryBox: [
      { label: 'Total Sales Volume', value: fmt(overview.totalSalesVolume) },
      { label: 'Platform Commission', value: fmt(overview.totalCommission) },
      { label: 'Net Vendor Revenue', value: fmt(netVendorRevenue) },
    ],
    columns: ['#', 'Company Name', 'Properties Sold', 'Sales Amount', 'Commission', 'Net Margin', 'Period'],
    colWidths: [25, 140, 65, 75, 75, 75, 40],
    rows,
    summaryRows: [
      { label: 'Total Bookings', value: overview.totalBookings },
      { label: 'Total Sales Volume', value: fmt(overview.totalSalesVolume) },
      { label: 'Platform Commission', value: fmt(overview.totalCommission) },
      { label: 'Net Vendor Revenue', value: fmt(netVendorRevenue) },
    ],
  });

  return { pdfBuffer, filename: `FlatSell-Margin-Report-${Date.now()}.pdf` };
};

module.exports = {
  getPlatformOverviewService,
  getCompanyBreakdownService,
  getPropertyBreakdownService,
  getMarginReportPDFService,
};
