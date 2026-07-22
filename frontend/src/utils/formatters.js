export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '৳0';
  return `৳${Number(amount).toLocaleString('en-BD')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
