import { RoundRectangle } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { UIComponent } from '../../common/UIComponent';
import { UIScene } from '../../mainUI';
import { GameObjects } from 'phaser';
import {
  COLORS,
  smallerTextDark,
  speciesInfo,
  textDefaultsDark,
} from '../../common/UIConstants';
import { REGISTRY_KEYS } from '../../../../consts';
import { RandomOrganism } from '../../../../classes/entities/randomOrganism';
import { VisionOrganism } from '../../../../classes/entities/visionOrganism';
import { NeuralNetworkOrganism } from '../../../../classes/entities/neuralNetworkOrganism';
import { BootstrapFactory } from '../../common/bootstrapFactory';

export class OrganismBuilder extends UIComponent {
  private builderPreview: GameObjects.Arc;
  private organismTypeChooser: any;
  private sizeSlider: any;
  private speedSlider: any;
  private startingEnergySlider: any;
  private visionRadiusSlider: any;

  private sizeText: GameObjects.Text;
  private speedText: GameObjects.Text;
  private startingEnergyText: GameObjects.Text;
  private visionRadiusText: GameObjects.Text;

  constructor(scene: UIScene) {
    super(scene, {
      width: 600,
      height: 400,
      orientation: 'y',
      space: { left: 10, right: 10, top: 10, bottom: 10, item: 20 },
    });

    let background: RoundRectangle = new RoundRectangle(scene, {
      radius: 10,
      color: COLORS.CARD_GREY,
      strokeColor: 0x8f8f9c,
    }).setDepth(-1);
    scene.add.existing(background);

    this.sizeText = scene.add.text(0, 0, '50', smallerTextDark);
    this.speedText = scene.add.text(0, 0, '50', smallerTextDark);
    this.startingEnergyText = scene.add.text(0, 0, '100', smallerTextDark);
    this.visionRadiusText = scene.add.text(0, 0, '500', smallerTextDark);
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
    this.sizeSlider = BootstrapFactory.createSlider(
      scene,
      (e: any) => {
        this.setOrganismSize(parseInt(e.target.value));
      },
      this,
      20, // min
      60.3 // max - a bit more over 100 so that our display texts displays '100' (some truncation issues..)
    );

    // Speed of organism
    this.speedSlider = BootstrapFactory.createSlider(
      scene,
      (e: any) => {
        this.setOrganismSpeed(parseInt(e.target.value));
      },
      this,
      1, // Min
      100.1 // Max
    );

    // Starting energy of organism
    this.startingEnergySlider = BootstrapFactory.createSlider(
      scene,
      (e: any) => {
        this.setStartingEnergy(parseInt(e.target.value));
      },
      this,
      1, // Minimum
      200.1 // Maximum
    );

    // Vision radius of organism
    this.visionRadiusSlider = BootstrapFactory.createSlider(
      scene,
      (e: any) => {
        this.setVisionRadius(parseInt(e.target.value));
      },
      this,
      20, // min
      500 // max - a bit more over 100 so that our display texts displays '100' (some truncation issues..)
    );

    // Organism type
    this.organismTypeChooser = BootstrapFactory.createDropdown(
      scene,
      (e: any) => {
        let organism = null;

        switch (e.target.value) {
          case 'NeuralNetworkOrganism':
            organism = NeuralNetworkOrganism;
            break;
          case 'RandomOrganism':
            organism = RandomOrganism;
            break;
          case 'VisionOrganism':
            organism = VisionOrganism;
            break;
        }

        scene.registry.set(REGISTRY_KEYS.organismType, organism);
      },
      this,
      [
        { displayText: 'Neural Network', value: 'NeuralNetworkOrganism' },
        { displayText: 'Random', value: 'RandomOrganism' },
        { displayText: 'Vision', value: 'VisionOrganism' },
      ]
    );

    /* Text at the top of the card */
    let cardText = scene.rexUI.add.label({
      text: scene.add.text(0, 0, 'Organism Builder', textDefaultsDark),
      height: 35,
    });

    /* Left side should contain the controls */
    let leftSide = scene.rexUI.add
      .sizer({ orientation: 'y', width: 250, space: { item: 20 } })
      .add(
        scene.rexUI.add.sizer().add(
          scene.rexUI.add
            .sizer({ orientation: 'x', space: { item: 10 } })
            .add(
              scene.rexUI.add
                .sizer({ orientation: 'y', space: { item: 20 } })
                .add(scene.add.text(0, 0, 'Size', smallerTextDark), {
                  align: 'right',
                })
                .add(scene.add.text(0, 0, 'Speed', smallerTextDark), {
                  align: 'right',
                })
                .add(scene.add.text(0, 0, 'Energy', smallerTextDark), {
                  align: 'right',
                })
                .add(scene.add.text(0, 0, 'Vision Radius', smallerTextDark), {
                  align: 'right',
                })
            )
            .add(
              scene.rexUI.add
                .sizer({ orientation: 'y', space: { item: 20 } })
                .add(this.sizeSlider)
                .add(this.speedSlider)
                .add(this.startingEnergySlider)
                .add(this.visionRadiusSlider)
            )
            .add(
              scene.rexUI.add
                .sizer({ orientation: 'y', space: { item: 20 } })
                .add(this.sizeText, { align: 'left' })
                .add(this.speedText, { align: 'left' })
                .add(this.startingEnergyText, { align: 'left' })
                .add(this.visionRadiusText, { align: 'left' })
            )
        )
      )
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x', space: { item: 50 } })
          .add(scene.add.text(0, 0, 'Type', smallerTextDark))
          .add(this.organismTypeChooser)
      )
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(scene.add.text(0, 0, 'Colour', smallerTextDark))
          .add(colorPicker)
      );

    /* Right side should contain the preview only */
    let rightSide = scene.rexUI.add
      .sizer({ width: 250, space: { left: 150 } })
      .add(this.builderPreview);

    this.add(cardText)
      .add(scene.rexUI.add.sizer().add(leftSide).add(rightSide))
      .addBackground(background)
      .layout()
      .setDepth(-1);
  }

  reset(): void {
    this.setStartingEnergy(100);
    this.setOrganismSpeed(50);
    this.setOrganismSize(20);
    this.setVisionRadius(250);

    this.setColour(0xe8000b);

    this.organismTypeChooser.node.children[0].value = 'NeuralNetworkOrganism';
  }

  /* Functions to set variables on the Phaser side of things, by taking input
   * from the input fields
   */

  private setColour(color: number): void {
    this.scene.registry.set(REGISTRY_KEYS.organismColour, color);
    this.builderPreview.fillColor = color;
  }

  private setVisionRadius(value: number): void {
    this.scene.registry.set(REGISTRY_KEYS.organismVisionRadius, value);
    this.visionRadiusSlider.node.children[0].value = value;
    this.visionRadiusText.setText(
      value.toLocaleString('en-us', {
        maximumFractionDigits: 0,
      })
    );
  }


  private setStartingEnergy(value: number): void {
    this.scene.registry.set(REGISTRY_KEYS.organismStartingEnergy, value);
    this.startingEnergySlider.node.children[0].value = value;
    this.startingEnergyText.setText(
      value.toLocaleString('en-us', {
        maximumFractionDigits: 0,
      })
    );
  }

  private setOrganismSize(value: number): void {
    this.scene.registry.set(REGISTRY_KEYS.organismSize, value);
    this.sizeSlider.node.children[0].value = value;
    this.builderPreview.setScale(value * 0.04);
    this.sizeText.setText(
      value.toLocaleString('en-us', {
        maximumFractionDigits: 0,
      })
    );
  }

  private setOrganismSpeed(value: number): void {
    this.scene.registry.set(REGISTRY_KEYS.organismSpeed, value);
    this.speedSlider.node.children[0].value = value;
    this.speedText.setText(
      value.toLocaleString('en-us', {
        maximumFractionDigits: 0,
      })
    );
  }
}
