import { GameObjects, Scene } from 'phaser';

import { RoundRectangle } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import { REGISTRY_KEYS } from '../../consts';
import { ChartsComponent } from './chartsComponent';
import { ScenarioControl } from './scenarioControl';
import { UIComponent } from './UIComponent';

const textDefaults = {
  fontSize: '30px',
  color: '#000',
  fontFamily: 'Helvetica',
  align: 'center',
  wordWrap: { width: 600 },
};

const smallerText = {
  fontSize: '20px',
  color: '#000',
  fontFamily: 'Helvetica',
  align: 'center',
  wordWrap: { width: 600 },
};

export class UIScene extends Scene {
  public rexUI: RexUIPlugin;
  private chartsComponent: ChartsComponent;
  private scenarioControl: UIComponent;

  constructor() {
    super('ui-scene');
  }

  preload(): void {
    this.load.script('chartjs', 'https://cdn.jsdelivr.net/npm/chart.js');
  }

  create(): void {
    this.chartsComponent = new ChartsComponent(this);
    this.scenarioControl = new ScenarioControl(this);

    this.resetScene();
    this.initTexts();
    this.initInteractiveElements();
  }

  update(time: number, delta: number): void {}

  public resetScene(): void {
    let envScene = this.scene.get('environment-scene');
    envScene.scene.restart();

    this.chartsComponent.reset();
    this.scenarioControl.reset();

    this.registry.set(REGISTRY_KEYS.worldAge, 0);
    this.registry.set(REGISTRY_KEYS.organismColour, 0xe8000b);
    this.registry.set(REGISTRY_KEYS.organismSize, 50);
    this.registry.set(REGISTRY_KEYS.organismSpeed, 50);
  }

  private initInteractiveElements(): void {
    // Organism builder
    let background: RoundRectangle = new RoundRectangle(this, {
      width: 1,
      height: 1,
      radius: 10,
      color: 0xe9e9ed,
      strokeColor: 0x8f8f9c,
    }).setDepth(-1);
    this.add.existing(background);

    let sizeText: GameObjects.Text = this.add.text(0, 0, '50', smallerText);
    let speedText: GameObjects.Text = this.add.text(0, 0, '50', smallerText);
    let builderPreview: GameObjects.Arc = this.add.circle(0, 0, 12, 0xe8000b);

    // Colour of organism
    let setColour = (color: number) => {
      this.registry.set(REGISTRY_KEYS.organismColour, color);
      builderPreview.fillColor = color;
    };

    let colorPicker = this.rexUI.add
      .sizer({
        orientation: 'y',
        space: { left: 10, right: 10, top: 10, bottom: 10, item: 20 },
      })
      .add(
        this.rexUI.add
          .sizer({ space: { item: 10 } })
          .add(
            this.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0xe8000b)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  setColour(0xe8000b);
                },
                this
              )
          )
          .add(
            this.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0xff7c00)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  setColour(0xff7c00);
                },
                this
              )
          )
          .add(
            this.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0xffc400)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  setColour(0xffc400);
                },
                this
              )
          )
          .add(
            this.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0x1ac938)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  setColour(0x1ac938);
                },
                this
              )
          )
      )
      .add(
        this.rexUI.add
          .sizer({ space: { item: 10 } })
          .add(
            this.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0x00d7ff)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  setColour(0x00d7ff);
                },
                this
              )
          )
          .add(
            this.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0x023eff)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  setColour(0x023eff);
                },
                this
              )
          )
          .add(
            this.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0x8b2be2)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  setColour(0x8b2be2);
                },
                this
              )
          )
          .add(
            this.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0xf14cc1)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  setColour(0xf14cc1);
                },
                this
              )
          )
      )
      .layout();

    // Size of organism
    let sizeSlider = this.rexUI.add
      .slider({
        width: 100,
        height: 10,
        valuechangeCallback: (value) => {
          this.registry.set(REGISTRY_KEYS.organismSize, value * 100);
          builderPreview.setScale(value * 5);
          sizeText.setText(
            (value * 100).toLocaleString('en-us', {
              maximumFractionDigits: 0,
            })
          );
        },
        input: 'click',
        space: { top: 4, bottom: 4 },
        value: 0.5,

        track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 6, 0x000000),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x8f8f9c),
      })
      .layout();

    // Speed of organism
    let speedSlider = this.rexUI.add
      .slider({
        width: 100,
        height: 10,
        valuechangeCallback: (value) => {
          this.registry.set(REGISTRY_KEYS.organismSpeed, value * 100);
          speedText.setText(
            (value * 100).toLocaleString('en-us', {
              maximumFractionDigits: 0,
            })
          );
        },
        input: 'click',
        space: { top: 4, bottom: 4 },
        value: 0.5,

        track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 6, 0x000000),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x8f8f9c),
      })
      .layout();

    this.rexUI.add
      .sizer({
        x: 180,
        y: 600,
        width: 270,
        orientation: 'y',
        space: { left: 10, right: 10, top: 10, bottom: 10, item: 20 },
      })
      .add(this.add.text(0, 0, 'Organism Preview', smallerText))
      .add(this.add.zone(0, 0, 0, 0), 10, 'center')
      .add(this.add.zone(0, 0, 0, 0), 10, 'center')
      .add(builderPreview)
      .add(this.add.zone(0, 0, 0, 0), 10, 'center')
      .add(this.add.zone(0, 0, 0, 0), 10, 'center')
      .add(
        this.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(this.add.text(0, 0, 'Size', smallerText))
          .add(sizeSlider)
          .add(sizeText)
      )
      .add(
        this.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(this.add.text(0, 0, 'Speed', smallerText))
          .add(speedSlider)
          .add(speedText)
      )
      .add(
        this.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(this.add.text(0, 0, 'Colour', smallerText))
          .add(colorPicker)
      )
      .addBackground(background)
      .layout()
      .setDepth(-1);
  }

  private initTexts(): void {
    this.add.text(0, 0, "Jia's Life\nSimulator", textDefaults);
  }
}
