import { Scene } from 'phaser';

import { Food } from '../classes/entities/food';
import { EVENTS_NAME, REGISTRY_KEYS } from '../consts';
import { IOrganism, OrganismConfigs } from '../typedefs';
import { Organism } from '../classes/entities/organism';
import { COLORS } from './ui/UIConstants';
import { RandomOrganism } from '../classes/entities/randomOrganism';

export class EnvironmentScene extends Scene {
  public organisms: Phaser.GameObjects.Group;
  private currentScenario: number;

  private static readonly foodSpawnDelayInMilliseconds: number = 1500;
  private static readonly worldX: number = 20;
  private static readonly worldY: number = 40;
  private static readonly worldWidth: number = 1200;
  private static readonly worldHeight: number = 900;

  constructor() {
    super('environment-scene');
  }

  create(): void {
    this.currentScenario = 0; // Default, empty canvas
    this.organisms = this.add.group();
    this.physics.add.collider(this.organisms, this.organisms);
    this.organisms.runChildUpdate = true;

    this.physics.world.setFPS(30);

    this.initCanvas();
    this.initListeners();
    this.initEvents();
  }

  update(time: number, delta: number): void {
    let worldAge: number = this.registry.get(REGISTRY_KEYS.worldAge);
    this.registry.set(REGISTRY_KEYS.worldAge, worldAge + this.time.timeScale);
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

  private initEvents(): void {
    this.time.addEvent({
      delay: EnvironmentScene.foodSpawnDelayInMilliseconds,
      callback: this.generateNewFood,
      callbackScope: this,
      loop: true,
    });
  }

  private initCanvas(): void {
    this.physics.world.setBounds(
      EnvironmentScene.worldX,
      EnvironmentScene.worldY,
      EnvironmentScene.worldWidth,
      EnvironmentScene.worldHeight
    );

    let visualBorder = this.add.rectangle(
      EnvironmentScene.worldWidth / 2 + EnvironmentScene.worldX, // x position (center)
      EnvironmentScene.worldHeight / 2 + EnvironmentScene.worldY, // y position (center)
      EnvironmentScene.worldWidth,
      EnvironmentScene.worldHeight,
      COLORS.OFF_WHITE,
      1
    );
    visualBorder.setStrokeStyle(1, 0x000000);

    // Generate new species when clicking on canvas
    visualBorder
      .setInteractive()
      .on('pointerdown', (_: any, localX: number, localY: number) => {
        this.addToSpecies(
          {
            scene: this,
            velocity: this.registry.get(REGISTRY_KEYS.organismSpeed),
            size: this.registry.get(REGISTRY_KEYS.organismSize),
            x: localX + EnvironmentScene.worldX,
            y: localY + EnvironmentScene.worldY,
            color: this.registry.get(REGISTRY_KEYS.organismColour),
            species: this.registry.get(REGISTRY_KEYS.organismSpecies),
            startingEnergy: this.registry.get(REGISTRY_KEYS.organismStartingEnergy),
          },
          this.registry.get(REGISTRY_KEYS.organismType)
        );
      });
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
    var food = new Food({
      scene: this,
      x: Math.random() * EnvironmentScene.worldWidth + EnvironmentScene.worldX,
      y: Math.random() * EnvironmentScene.worldHeight + EnvironmentScene.worldY,
    });
    food.addPredator(this.organisms);
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
