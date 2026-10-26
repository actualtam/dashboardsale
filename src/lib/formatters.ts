export function formatCurrency(amount: number | string | any, currency = 'UZS'): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount) || '0');
  if (isNaN(num)) return '0 UZS';
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(num) + ' ' + currency;
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatShortDate(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
  }).format(d);
}
