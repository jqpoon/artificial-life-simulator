import { Food } from "../entities/food";
import { Organism } from "../entities/organism";

export class OrganismUtils {
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

  public static getNearestFood(organism: Organism, bodies: (Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody)[]) {
    let foods = bodies.filter(function (element, index, arr) {
      return element.gameObject.name === 'food';
    });

    let nearestFood: Food | null = null;
    let nearestDistance = Infinity;
    foods.forEach(function (element, index, arr) {
      let food = element as unknown as Food;
      let distance = Phaser.Math.Distance.Between(organism.x, organism.y, food.x, food.y)
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestFood = food;
      }
    });

    return nearestFood;
  }
}
