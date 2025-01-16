export async function getUserDetails(pb, userId) {
  try {
    if (!userId) return null;

    const record = await pb.collection("usersku").getOne(userId, {
      fields: "id,username,name,email,avatar_url",
    });

    return record;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}

export async function getUsername(pb, userId) {
  try {
    if (!userId) return null;

    const record = await pb.collection("usersku").getOne(userId);

    // Return name if available, otherwise username
    return record.name || record.username || null;
  } catch (error) {
    console.error("Error fetching username:", error);
    return null;
  }
}

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
