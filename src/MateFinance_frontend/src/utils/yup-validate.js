// Define the noWhiteSpaces validation function
export const noWhiteSpaces = (value) => {
  if (value.length === 1) {
    // For a single character, we check if it is not a whitespace character.
    return !/\s/.test(value);
  }
  // For multiple characters, we check the original regex pattern.
  return /^[^\s].*[^\s]$/.test(value);
};
