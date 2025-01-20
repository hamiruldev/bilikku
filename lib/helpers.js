import { PUBLIC_ROUTES } from "./constants";

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

export function authGuard() {
  const currentPath = window.location.pathname;
  const userRole = localStorage.getItem("userRole");

  // If user is admin and tries to access bilikku, redirect to dashboard
  if (userRole === "admin" && currentPath === "/bilikku") {
    window.location.href = "/dashboard";
    return;
  }

  // If user is guest/not logged in
  if (userRole === "guest" && currentPath.startsWith("/dashboard")) {
    window.location.href = "/bilikku";
    return;
  }

  if (!userRole) {
    window.location.href = "/login";
    return;
  }
}
