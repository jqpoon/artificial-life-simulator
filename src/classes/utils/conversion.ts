export class Conversion {
  /**
   * Converts a hexadecimal color from a number to a string (e.g. #ff0000).
   *
   * @param color - The color to be converted as a number
   * @returns The color as a 6-digit hexadecimal string starting with a '#'
   */
  public static numberColorToStringColour(color: number): string {
    return '#' + color.toString(16).padStart(6, '0');
  }

  /**
   * Converts a hexadecimal color from a string to a number.
   *
   * @param color - The color as a 6-digit hexadecimal string starting with a '#'
   * @returns The converted color as a number
   */
  public static stringColorToNumberColour(color: string): number {
    return parseInt(color.substring(1), 16); // Ignores '#' and parses the rest
  }
}
