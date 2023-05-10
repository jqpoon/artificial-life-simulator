import { Food } from "../entities/food";
import { Organism } from "../entities/organism";

export class OrganismUtils {
  /**
   * Energy loss is calculated as a function of size based on Kleiber's law
   *
   * @param size - Size of organism
   * @returns Energy loss of organism
   */
  public static calculateBasalEnergyLoss(size: number): number {
    return 0.001 * Math.pow(size, 0.75);
  }

  /**
   * Finds the nearest food object to an organism and returns it
   *
   * @param organism - The organism in question
   * @param bodies - List of bodies / static bodies to look through
   * @returns Nearest food object, or null if there are none
   */
  public static getNearestFood(organism: Organism, bodies: (Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody)[]): Food | null {
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
