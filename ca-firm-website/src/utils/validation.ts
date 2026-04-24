/**
 * Validation utility functions for form inputs
 */

/**
 * Validates email format using regex
 * @param email - Email string to validate
 * @returns true if valid email format, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates that a required field is not empty
 * @param value - Field value to validate
 * @returns true if field has content, false if empty or whitespace-only
 */
export const isRequiredFieldValid = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates that a string is not only whitespace
 * @param value - String to validate
 * @returns true if contains non-whitespace characters, false otherwise
 */
export const hasNonWhitespaceContent = (value: string): boolean => {
  return value.trim().length > 0;
};
