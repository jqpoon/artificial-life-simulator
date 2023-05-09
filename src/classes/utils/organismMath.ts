export class OrganismMath {
  /**
   * Returns a new value that is between min and max, by clamping the given value.
   *
   * @param value - Value to be clamped
   * @param min
   * @param max
   *
   * @returns The clamped value
   */
  public static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
  }

  /**
   * Energy loss is calculated as a function of size based on Kleiber's law
   *
   * @param size - Size of organism
   *
   * @returns Energy loss of organism
   */
  public static calculateBasalEnergyLoss(size: number): number {
    return 0.001 * Math.pow(size, 0.75);
  }
}
