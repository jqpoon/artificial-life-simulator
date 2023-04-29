import { Scene } from 'phaser';

import { Food } from '../classes/entities/food';
import { Organism } from '../classes/entities/organism';
import { RandomOrganism } from '../classes/entities/randomOrganism';
import { EVENTS_NAME, REGISTRY_KEYS } from '../consts';
import { OrganismConfigs } from '../typedefs';

export class EnvironmentScene extends Scene {
  public organisms: Phaser.GameObjects.Group;
  private currentScenario: number;

  private static readonly foodSpawnDelayInMilliseconds: number = 1500;
  private static readonly worldX: number = 400;
  private static readonly worldY: number = 50;
  private static readonly worldWidth: number = 800;
  private static readonly worldHeight: number = 800;

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
      0xffffff,
      0
    );
    visualBorder.setStrokeStyle(1, 0x000000);

    // Generate new species when clicking on canvas
    visualBorder
      .setInteractive()
      .on('pointerdown', (_: any, localX: number, localY: number) => {
        this.createNewSpecies({
          scene: this,
          velocity: this.registry.get(REGISTRY_KEYS.organismSpeed),
          size: this.registry.get(REGISTRY_KEYS.organismSize),
          x: localX + EnvironmentScene.worldX,
          y: localY + EnvironmentScene.worldY,
          color: this.registry.get(REGISTRY_KEYS.organismColour),
        });
      });
  }

  private createNewSpecies(configs: OrganismConfigs): void {
    let speciesCount = this.registry.get(REGISTRY_KEYS.chartDataset).length;
    this.game.events.emit(EVENTS_NAME.createNewSpecies, configs);

    let newOrganism = new RandomOrganism({
      scene: this,
      x: configs.x,
      y: configs.y,
      color: configs.color,
      size: configs.size,
      velocity: configs.velocity,
      species: speciesCount,
    });

    this.addOrganismToGroup(newOrganism);
  }

  private updateTimeScale(timeScale: number): void {
    this.tweens.timeScale = timeScale;
    this.physics.world.timeScale = 1 / timeScale;
    this.time.timeScale = timeScale;

    if (timeScale == 0) {
      this.scene.pause();
    } else {
      this.scene.resume();
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
    this.createNewSpecies({
      scene: this,
      velocity: 80,
      size: 30,
      x: 10,
      y: 100,
      color: 0x8b2be2,
      energyLoss: 0.5,
    });

    this.registry.set(REGISTRY_KEYS.organismColour, 0xffc400);
    this.createNewSpecies({
      scene: this,
      velocity: 35,
      size: 80,
      x: 10,
      y: 10,
      color: 0xffc400,
      energyLoss: 0.1,
    });
  }

  public loadScenario2(): void {
    this.registry.set(REGISTRY_KEYS.organismColour, 0x8b2be2);
    this.createNewSpecies({
      scene: this,
      velocity: 50,
      size: 20,
      x: 0,
      y: 400,
      color: 0x8b2be2,
    });
  }
}
