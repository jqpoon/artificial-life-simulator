import { RoundRectangle, Slider } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { UIComponent } from './UIComponent';
import { UIScene } from './mainUI';
import { GameObjects } from 'phaser';
import { smallerText } from './UIConstants';
import { REGISTRY_KEYS } from '../../consts';

export class OrganismBuilder extends UIComponent {
  private speedSlider: Slider;
  private sizeSlider: Slider;
  private builderPreview: GameObjects.Arc;

  constructor(scene: UIScene) {
    super(scene, {
      x: 180,
      y: 600,
      width: 270,
      orientation: 'y',
      space: { left: 10, right: 10, top: 10, bottom: 10, item: 20 },
    });

    // Organism builder
    let background: RoundRectangle = new RoundRectangle(scene, {
      width: 1,
      height: 1,
      radius: 10,
      color: 0xe9e9ed,
      strokeColor: 0x8f8f9c,
    }).setDepth(-1);
    scene.add.existing(background);

    let sizeText: GameObjects.Text = scene.add.text(0, 0, '50', smallerText);
    let speedText: GameObjects.Text = scene.add.text(0, 0, '50', smallerText);
    this.builderPreview = scene.add.circle(0, 0, 12, 0xe8000b);

    let colorPicker = scene.rexUI.add
      .sizer({
        orientation: 'y',
        space: { left: 10, right: 10, top: 10, bottom: 10, item: 20 },
      })
      .add(
        scene.rexUI.add
          .sizer({ space: { item: 10 } })
          .add(
            scene.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0xe8000b)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  this.setColour(0xe8000b);
                },
                this
              )
          )
          .add(
            scene.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0xff7c00)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  this.setColour(0xff7c00);
                },
                this
              )
          )
          .add(
            scene.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0xffc400)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  this.setColour(0xffc400);
                },
                this
              )
          )
          .add(
            scene.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0x1ac938)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  this.setColour(0x1ac938);
                },
                this
              )
          )
      )
      .add(
        scene.rexUI.add
          .sizer({ space: { item: 10 } })
          .add(
            scene.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0x00d7ff)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  this.setColour(0x00d7ff);
                },
                this
              )
          )
          .add(
            scene.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0x023eff)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  this.setColour(0x023eff);
                },
                this
              )
          )
          .add(
            scene.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0x8b2be2)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  this.setColour(0x8b2be2);
                },
                this
              )
          )
          .add(
            scene.rexUI.add
              .roundRectangle(0, 0, 30, 30, 3, 0xf14cc1)
              .setInteractive()
              .on(
                'pointerdown',
                () => {
                  this.setColour(0xf14cc1);
                },
                this
              )
          )
      )
      .layout();

    // Size of organism
    this.sizeSlider = scene.rexUI.add
      .slider({
        width: 100,
        height: 10,
        valuechangeCallback: (value) => {
          scene.registry.set(REGISTRY_KEYS.organismSize, value * 100);
          this.builderPreview.setScale(value * 5);
          sizeText.setText(
            (value * 100).toLocaleString('en-us', {
              maximumFractionDigits: 0,
            })
          );
        },
        input: 'click',
        space: { top: 4, bottom: 4 },
        value: 0.5,

        track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 6, 0x000000),
        thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x8f8f9c),
      })
      .layout();

    // Speed of organism
    this.speedSlider = scene.rexUI.add
      .slider({
        width: 100,
        height: 10,
        valuechangeCallback: (value) => {
          scene.registry.set(REGISTRY_KEYS.organismSpeed, value * 100);
          speedText.setText(
            (value * 100).toLocaleString('en-us', {
              maximumFractionDigits: 0,
            })
          );
        },
        input: 'click',
        space: { top: 4, bottom: 4 },
        value: 0.5,

        track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 6, 0x000000),
        thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x8f8f9c),
      })
      .layout();

    this.add(scene.add.text(0, 0, 'Organism Preview', smallerText))
      .add(scene.add.zone(0, 0, 0, 0), 10, 'center')
      .add(scene.add.zone(0, 0, 0, 0), 10, 'center')
      .add(this.builderPreview)
      .add(scene.add.zone(0, 0, 0, 0), 10, 'center')
      .add(scene.add.zone(0, 0, 0, 0), 10, 'center')
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 20 } })
              .add(scene.add.text(0, 0, 'Size', smallerText))
              .add(scene.add.text(0, 0, 'Speed', smallerText))
          )
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 20 } })
              .add(this.sizeSlider)
              .add(this.speedSlider)
          )
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 20 } })
              .add(sizeText)
              .add(speedText)
          )
      )
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(scene.add.text(0, 0, 'Colour', smallerText))
          .add(colorPicker)
      )
      .addBackground(background)
      .layout()
      .setDepth(-1);
  }

  reset(): void {
    this.speedSlider.setValue(0.5);
    this.sizeSlider.setValue(0.5);
    this.setColour(0xe8000b);
  }

  private setColour(color: number): void {
    this.scene.registry.set(REGISTRY_KEYS.organismColour, color);
    this.builderPreview.fillColor = color;
  };
}
