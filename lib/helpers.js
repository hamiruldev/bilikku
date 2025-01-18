// Function to format date based on locale
export function formatDate(date, locale = "en") {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString(locale);
}

// Function to format currency based on locale
export function formatCurrency(amount, currency = "MYR", locale = "en-MY") {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}
