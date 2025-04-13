// supports 06 & 07 french number
// const phone = sanitize("06-12-34-56-78");
// console.log(phone); // Output: "0612345678"
export const sanitizePhone = function (
  phone: string,
  sep: string = ''
): string | null {
  // Remove any non-digit characters
  let digits = (phone || '').replace(/\D/g, '');
  // replace 33 with 0
  if (/^33[67]/.test(digits)) digits = '0' + digits.substring(2);

  // Ensure the number has 10 digits and starts with '06' or '07'
  if (digits.length === 10 && /^0[67]/.test(digits))
    return digits.replace(
      /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
      `$1${sep}$2${sep}$3${sep}$4${sep}$5`
    );

  return null; // Return null for invalid input
};
