import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import { Scene } from 'phaser';
import { REGISTRY_KEYS } from '../../consts';
import { NeuralNetworkOrganism } from '../../classes/entities/neuralNetworkOrganism';

import { COLORS } from './common/UIConstants';
import { SidePanel } from './sidePanel/sidePanel';
import { BottomPanel } from './bottomPanel/bottomPanel';

export class UIScene extends Scene {
  public rexUI: RexUIPlugin;
  private sidePanel: SidePanel;
  private bottomPanel: BottomPanel;

  constructor() {
    super('ui-scene');
  }

  preload(): void {
    this.load.image('pause', 'assets/pause.png');
    this.load.image('speed1', 'assets/speed1.png');
    this.load.image('speed2', 'assets/speed2.png');
    this.load.image('speed3', 'assets/speed3.png');
    this.load.image('arrow', 'assets/arrow.png');
  }

  create(): void {
    this.sidePanel = new SidePanel(this);
    this.bottomPanel = new BottomPanel(this);

    this.resetScene();
    this.cameras.main.setBackgroundColor(COLORS.BACKGROUND_COLOR);
  }

  update(time: number, delta: number): void {}

  public resetScene(): void {
    let envScene = this.scene.get('environment-scene');
    envScene.scene.restart();

    this.sidePanel.reset();
    this.bottomPanel.reset();

    this.registry.set(REGISTRY_KEYS.worldAge, 0);
    this.registry.set(REGISTRY_KEYS.energyLoss, 1);
    this.registry.set(REGISTRY_KEYS.organismSpecies, 0);
    this.registry.set(REGISTRY_KEYS.organismColour, 0xe8000b);
    this.registry.set(REGISTRY_KEYS.organismSize, 50);
    this.registry.set(REGISTRY_KEYS.organismSpeed, 50);
    this.registry.set(REGISTRY_KEYS.organismType, NeuralNetworkOrganism);
  }
}
