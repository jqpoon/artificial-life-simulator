import { Scene } from 'phaser';

import { Food } from '../classes/entities/food';
import { EVENTS_NAME, REGISTRY_KEYS, GAME_CONSTANTS } from '../consts';
import { IOrganism, OrganismConfigs } from '../typedefs';
import { Organism } from '../classes/entities/organism';
import { COLORS } from './ui/common/UIConstants';
import { RandomOrganism } from '../classes/entities/randomOrganism';

export class EnvironmentScene extends Scene {
  public organisms: Phaser.GameObjects.Group;
  private foods: Phaser.GameObjects.Group;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private currentScenario: number = 0; // Default, empty canvas
  private foodSpawnCounter: number = 0;
  private timeCounter: number = 0;

  private static readonly foodSpawnDelayInMilliseconds: number = 3000;
  private static readonly foodOffsetFromEdges: number = 300;

  constructor() {
    super('environment-scene');
  }

  create(): void {
    this.organisms = this.add.group();
    this.foods = this.add.group();
    this.physics.add.collider(this.organisms, this.organisms);
    this.organisms.runChildUpdate = true;

    this.physics.world.setFPS(15);

    if (this.input.keyboard) {
      this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    this.initCanvas();
    this.initListeners();
  }

  update(time: number, delta: number): void {
    /* Scale update frequency depending on timescale. Larger timescale = more frequent update */
    this.timeCounter += delta;
    if (
      this.timeCounter <=
      200 / this.registry.get(REGISTRY_KEYS.timeScale)
    )
      return;
    this.timeCounter = 0;

    let worldAge: number = this.registry.get(REGISTRY_KEYS.worldAge);
    this.registry.set(REGISTRY_KEYS.worldAge, worldAge + this.time.timeScale);

    this.foodSpawnCounter += delta;
    let threshold = 100 / this.registry.get(REGISTRY_KEYS.foodSpawnRate);
    if (this.foodSpawnCounter >= threshold) {
      this.foodSpawnCounter -= threshold;

      /* Only spawn food if we haven't hit the limit */
      if (
        this.foods.countActive() <=
        this.registry.get(REGISTRY_KEYS.foodSpawnLimit)
      ) {
        this.generateNewFood();
      }
    }
  }

  private initListeners(): void {
    this.game.events.on(EVENTS_NAME.reproduceOrganism, (organism: Organism) => {
      this.addOrganismToGroup(organism);
    });

    this.game.events.on(EVENTS_NAME.loadScenario, (scenarioID: number) => {
      // Without this, the scenario is loaded multiple times
      if (scenarioID == this.currentScenario) return;

      this.currentScenario = scenarioID;
      switch (scenarioID) {
        case 1:
          this.loadScenario1();
          break;
        case 2:
          this.loadScenario2();
          break;
      }
    });

    this.game.events.on(EVENTS_NAME.updateTimeScale, (timeScale: number) => {
      this.updateTimeScale(timeScale);
    });
  }

  private initCanvas(): void {
    this.physics.world.setBounds(
      GAME_CONSTANTS.worldX,
      GAME_CONSTANTS.worldY,
      GAME_CONSTANTS.worldWidth,
      GAME_CONSTANTS.worldHeight
    );

    let visualBorder = this.add.rectangle(
      GAME_CONSTANTS.worldWidth / 2 + GAME_CONSTANTS.worldX, // x position (center)
      GAME_CONSTANTS.worldHeight / 2 + GAME_CONSTANTS.worldY, // y position (center)
      GAME_CONSTANTS.worldWidth,
      GAME_CONSTANTS.worldHeight,
      COLORS.OFF_WHITE,
      1
    );
    visualBorder.setStrokeStyle(1, 0x000000);

    // Generate new species when clicking on canvas
    visualBorder
      .setInteractive()
      .on('pointerdown', (_: any, localX: number, localY: number) => {
        if (this.cursorKeys.shift.isDown) {
          this.addOrganism(localX, localY);
          this.addOrganism(localX, localY);
          this.addOrganism(localX, localY);
          this.addOrganism(localX, localY);
          this.addOrganism(localX, localY);
        } else {
          this.addOrganism(localX, localY);
        }
      });
  }

  private addOrganism(localX: number, localY: number): void {
    this.addToSpecies(
      {
        scene: this,
        velocity: this.registry.get(REGISTRY_KEYS.organismSpeed),
        size: this.registry.get(REGISTRY_KEYS.organismSize),
        x: localX + GAME_CONSTANTS.worldX,
        y: localY + GAME_CONSTANTS.worldY,
        color: this.registry.get(REGISTRY_KEYS.organismColour),
        species: this.registry.get(REGISTRY_KEYS.organismSpecies),
        startingEnergy: this.registry.get(REGISTRY_KEYS.organismStartingEnergy),
      },
      this.registry.get(REGISTRY_KEYS.organismType)
    );
  }

  private addToSpecies(configs: OrganismConfigs, organism: IOrganism): void {
    let newOrganism = new organism(configs);
    this.addOrganismToGroup(newOrganism);
  }

  private updateTimeScale(timeScale: number): void {
    this.tweens.timeScale = timeScale;
    this.physics.world.timeScale = 1 / timeScale;
    this.time.timeScale = timeScale;
    this.registry.set(REGISTRY_KEYS.timeScale, timeScale);

    if (timeScale == 0) {
      this.physics.world.pause();
    } else {
      this.physics.world.resume();
    }
  }

  private generateNewFood(): void {
    let offset = EnvironmentScene.foodOffsetFromEdges; // Avoid spawning food near the edges

    let x =
      Math.random() * (GAME_CONSTANTS.worldWidth - offset) +
      (GAME_CONSTANTS.worldX + offset / 2);
    let y =
      Math.random() * (GAME_CONSTANTS.worldHeight - offset) +
      (GAME_CONSTANTS.worldY + offset / 2);

    var food = new Food({
      scene: this,
      x: x,
      y: y,
    });
    food.addPredator(this.organisms);
    this.foods.add(food);
  }

  private addOrganismToGroup(organism: Organism): void {
    this.organisms.add(organism);
  }

  public loadScenario1(): void {
    this.registry.set(REGISTRY_KEYS.organismColour, 0x8b2be2);
    this.addToSpecies(
      {
        scene: this,
        velocity: 80,
        size: 30,
        x: 10,
        y: 100,
        color: 0x8b2be2,
        energyLoss: 0.5,
        species: 6,
      },
      RandomOrganism
    );

    this.registry.set(REGISTRY_KEYS.organismColour, 0xffc400);
    this.addToSpecies(
      {
        scene: this,
        velocity: 35,
        size: 80,
        x: 10,
        y: 10,
        color: 0xffc400,
        energyLoss: 0.1,
        species: 2,
      },
      RandomOrganism
    );
  }

  public loadScenario2(): void {
    this.registry.set(REGISTRY_KEYS.organismColour, 0x8b2be2);
    this.addToSpecies(
      {
        scene: this,
        velocity: 50,
        size: 20,
        x: 0,
        y: 400,
        color: 0x8b2be2,
        species: 0,
      },
      RandomOrganism
    );
  }
}
