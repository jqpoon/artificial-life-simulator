import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import { Scene } from 'phaser';
import { EVENTS_NAME, REGISTRY_KEYS } from '../../consts';
import { NeuralNetworkOrganism } from '../../classes/entities/neuralNetworkOrganism';

import { COLORS } from './common/UIConstants';
import { SidePanel } from './sidePanel/sidePanel';
import { BottomPanel } from './bottomPanel/bottomPanel';
import { Tutorial } from './common/tutorial';

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

    /* Handle keyboard shortcuts */
    if (this.input.keyboard) {
      let rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
      rKey.on('down', () => {
        this.resetScene();
      });

      let deleteKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.BACKSPACE
      );
      deleteKey.on('down', () => {
        this.game.events.emit(EVENTS_NAME.killSelectedOrganism);
        this.game.events.emit(EVENTS_NAME.selectOrganism, {
          name: 'unselect',
        });
      });
    }

    this.resetScene();
    this.cameras.main.setBackgroundColor(COLORS.BACKGROUND_COLOR);

    let tut = new Tutorial(this);
  }

  update(time: number, delta: number): void {}

  public resetScene(): void {
    let envScene = this.scene.get('environment-scene');
    envScene.scene.restart();

    this.sidePanel.reset();
    this.bottomPanel.reset();

    this.registry.set(REGISTRY_KEYS.worldAge, 0);
    this.registry.set(REGISTRY_KEYS.energyLoss, 1);
    this.registry.set(REGISTRY_KEYS.energyGainPerFood, 50);
    this.registry.set(REGISTRY_KEYS.foodSpawnRate, 1);
    this.registry.set(REGISTRY_KEYS.foodSpawnLimit, 100);
    this.registry.set(REGISTRY_KEYS.mutationRate, 0.05);
    this.registry.set(REGISTRY_KEYS.mutateBrain, true);
    this.registry.set(REGISTRY_KEYS.mutateColour, false);
    this.registry.set(REGISTRY_KEYS.mutateSize, false);
    this.registry.set(REGISTRY_KEYS.mutateSpeed, false);
    this.registry.set(REGISTRY_KEYS.organismSpecies, 0);
    this.registry.set(REGISTRY_KEYS.organismColour, 0xe8000b);
    this.registry.set(REGISTRY_KEYS.organismSize, 20);
    this.registry.set(REGISTRY_KEYS.organismSpeed, 50);
    this.registry.set(REGISTRY_KEYS.organismType, NeuralNetworkOrganism);
  }
}
