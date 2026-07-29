

const now = () => new Date();

const monthsBetween = (from, to = now()) => {
  const a = new Date(from);
  const b = new Date(to);
  if (isNaN(a) || isNaN(b) || b < a) return 0;

  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  
  if (b.getDate() < a.getDate()) months -= 1;
  return Math.max(0, months);
};

const daysBetween = (from, to = now()) => {
  const a = new Date(from);
  const b = new Date(to);
  if (isNaN(a) || isNaN(b)) return 0;
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000);
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const addMonths = (date, n) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
};

const isWithinRefundWindow = (bookingDate, windowDays) =>
  daysBetween(bookingDate, now()) < windowDays;

module.exports = {
  now,
  monthsBetween,
  daysBetween,
  addDays,
  addMonths,
  isWithinRefundWindow,
};
