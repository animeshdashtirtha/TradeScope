export const formatCurrency = (value: number, compact = false) => {
  if (compact && value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (compact && value >= 1000) return `$${Math.round(value / 1000)}K`;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
};
export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(Math.round(value));
export const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${value}T12:00:00`));