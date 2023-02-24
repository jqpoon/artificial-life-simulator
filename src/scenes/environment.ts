import { Scene } from 'phaser';

import { Food } from '../classes/entities/food';
import { Organism } from '../classes/entities/organism';
import { RandomOrganism } from '../classes/entities/randomOrganism';
import { EVENTS_NAME, REGISTRY_KEYS } from '../consts';
import { UIScene } from './ui';

export class EnvironmentScene extends Scene {
  private organisms: Phaser.GameObjects.Group;

  private static readonly foodSpawnDelayInMilliseconds: number = 1500;
  private static readonly worldX: number = 300;
  private static readonly worldY: number = 50;
  private static readonly worldWidth: number = 800;
  private static readonly worldHeight: number = 800;

  constructor() {
    super('environment-scene');
  }

  create(): void {
    this.organisms = this.add.group();
    this.physics.add.collider(this.organisms, this.organisms);
    this.organisms.runChildUpdate = true;

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
    visualBorder.setInteractive().on('pointerdown', (_: any, localX: number, localY:number) => {
      let uiScene = this.scene.get('ui-scene') as UIScene;
      let speciesCount = this.registry.get(REGISTRY_KEYS.chartDataset).length;
      uiScene.newChartData(this.registry.get(REGISTRY_KEYS.organismColour));

      let newOrganism = new RandomOrganism({
        scene: this,
        x: localX + EnvironmentScene.worldX,
        y: localY + EnvironmentScene.worldY,
        color: this.registry.get(REGISTRY_KEYS.organismColour),
        size: this.registry.get(REGISTRY_KEYS.organismSize),
        velocity: this.registry.get(REGISTRY_KEYS.organismSpeed),
        name: speciesCount,
      });

      this.addOrganismToGroup(newOrganism);
    });
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
}
