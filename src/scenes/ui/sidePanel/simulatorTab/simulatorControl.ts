import { RoundRectangle } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { UIComponent } from '../../common/UIComponent';
import { UIScene } from '../../mainUI';
import {
  COLORS,
  smallerTextDark,
  textDefaultsDark,
} from '../../common/UIConstants';
import { REGISTRY_KEYS } from '../../../../consts';
import { BootstrapFactory } from '../../common/bootstrapFactory';

export class SimulatorControl extends UIComponent {
  private mutationRateSlider: Phaser.GameObjects.DOMElement;
  private energyLossSlider: Phaser.GameObjects.DOMElement;
  private energyPerFoodSlider: Phaser.GameObjects.DOMElement;
  private foodSpawnLimitSlider: Phaser.GameObjects.DOMElement;
  private foodSpawnRateSlider: Phaser.GameObjects.DOMElement;
  private mutateSizeSwitch: Phaser.GameObjects.DOMElement;
  private mutateSpeedSwitch: Phaser.GameObjects.DOMElement;
  private mutateColourSwitch: Phaser.GameObjects.DOMElement;
  private mutateBrainSwitch: Phaser.GameObjects.DOMElement;

  constructor(scene: UIScene) {
    super(scene, {
      x: 180,
      y: 700,
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

    /* Text at the top of the card */
    let cardText = scene.rexUI.add.label({
      text: scene.add.text(0, 0, 'Controls', textDefaultsDark),
      height: 50,
    });

    /* Controls global mutation rate */
    let mutationText = scene.add.text(0, 0, '0.05', smallerTextDark);
    this.mutationRateSlider = BootstrapFactory.createSlider(
      scene,
      (e: any) => {
        let value = parseFloat(e.target.value);
        scene.registry.set(REGISTRY_KEYS.mutationRate, value);
        mutationText.setText(
          value.toLocaleString('en-us', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })
        );
      },
      this,
      0, // Min
      1 // Max
    );

    /* Controls amount of energy gained per food item */
    let energyPerFoodText = scene.add.text(0, 0, '50', smallerTextDark);
    this.energyPerFoodSlider = BootstrapFactory.createSlider(
      scene,
      (e: any) => {
        let value = parseFloat(e.target.value);
        scene.registry.set(REGISTRY_KEYS.energyGainPerFood, value);
        energyPerFoodText.setText(
          value.toLocaleString('en-us', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          })
        );
      },
      this,
      10, // Min
      100 // Max
    );

    /* Controls the maximum amount of food that can be added to the world */
    let foodSpawnLimitText = scene.add.text(0, 0, '100', smallerTextDark);
    this.foodSpawnLimitSlider = BootstrapFactory.createSlider(
      scene,
      (e: any) => {
        let value = parseFloat(e.target.value);
        scene.registry.set(REGISTRY_KEYS.foodSpawnLimit, value);
        foodSpawnLimitText.setText(
          value.toLocaleString('en-us', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          })
        );
      },
      this,
      1, // Min
      300.3 // Max
    );

    /* Controls the maximum amount of food that can be added to the world */
    let foodSpawnRateText = scene.add.text(0, 0, '1.00', smallerTextDark);
    this.foodSpawnRateSlider = BootstrapFactory.createSlider(
      scene,
      (e: any) => {
        let value = parseFloat(e.target.value);
        scene.registry.set(REGISTRY_KEYS.foodSpawnRate, value);
        foodSpawnRateText.setText(
          value.toLocaleString('en-us', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })
        );
      },
      this,
      0, // Min
      5.02 // Max
    );

    /* Controls global energy loss rate */
    let energyLossText = scene.add.text(0, 0, '1.00', smallerTextDark);
    this.energyLossSlider = BootstrapFactory.createSlider(
      scene,
      (e: any) => {
        let value = parseFloat(e.target.value);
        scene.registry.set(REGISTRY_KEYS.energyLoss, value);
        energyLossText.setText(
          value.toLocaleString('en-us', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })
        );
      },
      this,
      0.1, // Min
      5.02 // Max
    );

    this.mutateSizeSwitch = BootstrapFactory.createSwitch(
      scene,
      false,
      (e: any) => {
        scene.registry.set(REGISTRY_KEYS.mutateSize, e.target.checked);
      },
      this
    );
    this.mutateSpeedSwitch = BootstrapFactory.createSwitch(
      scene,
      false,
      (e: any) => {
        scene.registry.set(REGISTRY_KEYS.mutateSpeed, e.target.checked);
      },
      this
    );
    this.mutateColourSwitch = BootstrapFactory.createSwitch(
      scene,
      false,
      (e: any) => {
        scene.registry.set(REGISTRY_KEYS.mutateColour, e.target.checked);
      },
      this
    );
    this.mutateBrainSwitch = BootstrapFactory.createSwitch(
      scene,
      true,
      (e: any) => {
        scene.registry.set(REGISTRY_KEYS.mutateBrain, e.target.checked);
      },
      this
    );

    this.add(cardText)
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x' })
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 20 } })
              .add(scene.add.text(0, 0, 'Mutation Rate', smallerTextDark), {
                align: 'right',
              })
              .add(scene.add.text(0, 0, 'Energy Loss Rate', smallerTextDark), {
                align: 'right',
              })
              .add(
                scene.add.text(0, 0, 'Energy Gain Per Food', smallerTextDark),
                {
                  align: 'right',
                }
              )
              .add(scene.add.text(0, 0, 'Food Spawn Limit', smallerTextDark), {
                align: 'right',
              })
              .add(scene.add.text(0, 0, 'Food Spawn Rate', smallerTextDark), {
                align: 'right',
              })
          )
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 25 } })
              .add(this.mutationRateSlider)
              .add(this.energyLossSlider)
              .add(this.energyPerFoodSlider)
              .add(this.foodSpawnLimitSlider)
              .add(this.foodSpawnRateSlider)
          )
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 20 } })
              .add(mutationText)
              .add(energyLossText)
              .add(energyPerFoodText)
              .add(foodSpawnLimitText)
              .add(foodSpawnRateText)
          )
      )
      .add(
        scene.rexUI.add
          .sizer({ space: { item: 30 } })
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 20 } })
              .add(scene.add.text(0, 0, 'Mutate size', smallerTextDark), {
                align: 'right',
              })
              .add(scene.add.text(0, 0, 'Mutate colour', smallerTextDark), {
                align: 'right',
              })
          )
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 20 } })
              .add(this.mutateSizeSwitch)
              .add(this.mutateColourSwitch)
          )
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 20 } })
              .add(scene.add.text(0, 0, 'Mutate speed', smallerTextDark), {
                align: 'right',
              })
              .add(scene.add.text(0, 0, 'Mutate brain', smallerTextDark), {
                align: 'right',
              })
          )
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 20 } })
              .add(this.mutateSpeedSwitch)
              .add(this.mutateBrainSwitch)
          )
      )
      .addBackground(background)
      .layout()
      .setDepth(-1);
  }

  reset(): void {
    (this.mutationRateSlider.node.children[0] as any).value = 0.05;
    (this.energyLossSlider.node.children[0] as any).value = 1;
    (this.energyPerFoodSlider.node.children[0] as any).value = 50;
    (this.foodSpawnLimitSlider.node.children[0] as any).value = 100;
    (this.foodSpawnRateSlider.node.children[0] as any).value = 1;

    (this.mutateSizeSwitch.node.children[0].children[0] as any).checked = false;
    (this.mutateSpeedSwitch.node.children[0].children[0] as any).checked = false;
    (this.mutateColourSwitch.node.children[0].children[0] as any).checked = false;
    (this.mutateBrainSwitch.node.children[0].children[0] as any).checked = true;
  }
}
