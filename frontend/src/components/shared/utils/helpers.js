/**
 * Parse a date string to DD/MM/YYYY format
 * @param {string} dateString - The date string to parse
 * @returns {string} Formatted date string
 */
export const parseDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Calculate the total amount from an array of nota spese
 * @param {Array} notaSpese - Array of expense notes
 * @returns {string} Total amount formatted to 2 decimal places
 */
export const getTotale = (notaSpese) => {
  if (!notaSpese || notaSpese.length === 0) return "0.00";
  
  const initialValue = 0;
  const importoSummed = notaSpese.reduce(
    (accumulator, spesa) => accumulator + (spesa.importo || 0),
    initialValue
  );

  return importoSummed?.toFixed(2);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Get category name from categories array
 * @param {Array} categories - Array of category objects
 * @param {string} categoryId - Category ID to find
 * @returns {string} Category name or "Uncategorized"
 */
export const getCategoryName = (categories, categoryId) => {
  if (!categoryId || !categories) return "Uncategorized";
  const category = categories.find((cat) => cat._id === categoryId);
  return category?.name || "Uncategorized";
};
