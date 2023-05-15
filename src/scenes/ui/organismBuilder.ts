import {
  DropDownList,
  RoundRectangle,
  Slider,
} from 'phaser3-rex-plugins/templates/ui/ui-components';
import { UIComponent } from './UIComponent';
import { UIScene } from './mainUI';
import { GameObjects } from 'phaser';
import {
  COLORS,
  smallerTextDark,
  speciesInfo,
  textDefaultsDark,
} from './UIConstants';
import { REGISTRY_KEYS } from '../../consts';
import { RandomOrganism } from '../../classes/entities/randomOrganism';
import { VisionOrganism } from '../../classes/entities/visionOrganism';
import { NeuralNetworkOrganism } from '../../classes/entities/neuralNetworkOrganism';

export class OrganismBuilder extends UIComponent {
  private builderPreview: GameObjects.Arc;
  private sizeSlider: Slider;
  private speedSlider: Slider;
  private organismTypeChooser: DropDownList;

  constructor(scene: UIScene) {
    super(scene, {
      x: 180,
      y: 700,
      width: 300,
      height: 400,
      orientation: 'y',
      space: { left: 10, right: 10, top: 10, bottom: 10, item: 20 },
    });

    let background: RoundRectangle = new RoundRectangle(scene, {
      width: 1,
      height: 1,
      radius: 10,
      color: 0xe9e9ed,
      strokeColor: 0x8f8f9c,
    }).setDepth(-1);
    scene.add.existing(background);

    let sizeText: GameObjects.Text = scene.add.text(
      0,
      0,
      '50',
      smallerTextDark
    );
    let speedText: GameObjects.Text = scene.add.text(
      0,
      0,
      '50',
      smallerTextDark
    );
    this.builderPreview = scene.add.circle(0, 0, 12, 0xe8000b);

    // Color picker
    let topColorPicker = scene.rexUI.add.sizer({ space: { item: 10 } });
    let bottomColorPicker = scene.rexUI.add.sizer({ space: { item: 10 } });

    Object.values(speciesInfo).forEach((species) => {
      let colorPicker;
      if (species.id <= 3) {
        colorPicker = topColorPicker;
      } else {
        colorPicker = bottomColorPicker;
      }

      colorPicker.add(
        scene.rexUI.add
          .roundRectangle(0, 0, 30, 30, 3, species.color)
          .setInteractive()
          .on(
            'pointerdown',
            () => {
              this.setColour(species.color);
              this.scene.registry.set(
                REGISTRY_KEYS.organismSpecies,
                species.id
              );
            },
            this
          )
      );
    });

    let colorPicker = scene.rexUI.add
      .sizer({
        orientation: 'y',
        space: { left: 10, right: 10, top: 10, bottom: 10, item: 20 },
      })
      .add(topColorPicker)
      .add(bottomColorPicker)
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

    // Organism type
    this.organismTypeChooser = scene.rexUI.add
      .simpleDropDownList({
        label: {
          space: { left: 10, right: 10, top: 10, bottom: 10 },
          background: {
            color: COLORS.BUTTON_MAIN,
          },
        },

        button: {
          space: { left: 10, right: 10, top: 10, bottom: 10 },
          background: {
            color: COLORS.BUTTON_MAIN,
            strokeWidth: 0,
            'hover.strokeColor': 0xffffff,
            'hover.strokeWidth': 2,
          },
        },

        list: {
          easeIn: 10,
          easeOut: 10,
          width: 50,
        },
      })
      .resetDisplayContent('Neural Network')
      .setOptions([
        { text: 'Neural Network', value: NeuralNetworkOrganism },
        { text: 'Random', value: RandomOrganism },
        { text: 'Vision', value: VisionOrganism },
      ])
      .on(
        'button.click',
        function (dropDownList: DropDownList, _: any, button: any) {
          dropDownList.setText(button.text);
          scene.registry.set(REGISTRY_KEYS.organismType, button.value);
        }
      );

    this.add(scene.add.text(0, 0, 'Organism Preview', textDefaultsDark))
      .add(scene.add.zone(0, 0, 0, 0), 10, 'center')
      .add(this.builderPreview)
      .add(scene.add.zone(0, 0, 0, 0), 10, 'center')
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 20 } })
              .add(scene.add.text(0, 0, 'Size', smallerTextDark))
              .add(scene.add.text(0, 0, 'Speed', smallerTextDark))
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
          .add(scene.add.text(0, 0, 'Colour', smallerTextDark))
          .add(colorPicker)
      )
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(scene.add.text(0, 0, 'Type', smallerTextDark))
          .add(this.organismTypeChooser)
      )
      .addBackground(background)
      .layout()
      .setDepth(-1);
  }

  reset(): void {
    this.speedSlider.setValue(0.5);
    this.sizeSlider.setValue(0.5);
    this.setColour(0xe8000b);
    this.organismTypeChooser.setText('Neural Network');
  }

  private setColour(color: number): void {
    this.scene.registry.set(REGISTRY_KEYS.organismColour, color);
    this.builderPreview.fillColor = color;
  }
}
