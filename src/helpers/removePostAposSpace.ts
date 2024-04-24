// Function to normalize addresses by removing spaces after apostrophes
export const removePostAposSpace = (address: string) => {
  // Remove spaces immediately following apostrophes
  return address.replace(/'\s+/g, "'");
};
