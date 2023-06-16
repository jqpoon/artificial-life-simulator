import { UIScene } from '../../mainUI';
import { TabComponent } from '../tabComponent';
import { ScenarioControl } from './scenarioControl';
import { smallerTextDark } from '../../common/UIConstants';
import { REGISTRY_KEYS } from '../../../../consts';
import { BootstrapFactory } from '../../common/bootstrapFactory';

export class SimulatorTab extends TabComponent {
  private scenarioControl: ScenarioControl;
  private mutationRateSlider: Phaser.GameObjects.DOMElement;
  private energyLossSlider: Phaser.GameObjects.DOMElement;
  private energyPerFoodSlider: Phaser.GameObjects.DOMElement;
  private foodSpawnLimitSlider: Phaser.GameObjects.DOMElement;
  private foodSpawnRateSlider: Phaser.GameObjects.DOMElement;

  constructor(scene: UIScene) {
    super(scene, {
      orientation: 'y',
      space: { left: 20, right: 20, top: 20, bottom: 20, item: 30 },
    });

    this.scenarioControl = new ScenarioControl(scene);

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
      100, // Max
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
      300.3, // Max
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
       5.02, // Max
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

    this.add(this.scenarioControl)
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x', space: { item: 20 } })
          .add(scene.add.text(0, 0, 'Mutation Rate', smallerTextDark))
          .add(this.mutationRateSlider)
          .add(mutationText)
      )
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x', space: { item: 20 } })
          .add(scene.add.text(0, 0, 'Energy Loss Rate', smallerTextDark))
          .add(this.energyLossSlider)
          .add(energyLossText)
      )
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x', space: { item: 20 } })
          .add(scene.add.text(0, 0, 'Energy Gain Per Food', smallerTextDark))
          .add(this.energyPerFoodSlider)
          .add(energyPerFoodText)
      )
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x', space: { item: 20 } })
          .add(scene.add.text(0, 0, 'Food Spawn Limit', smallerTextDark))
          .add(this.foodSpawnLimitSlider)
          .add(foodSpawnLimitText)
      )
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x', space: { item: 20 } })
          .add(scene.add.text(0, 0, 'Food Spawn Rate', smallerTextDark))
          .add(this.foodSpawnRateSlider)
          .add(foodSpawnRateText)
      )
      .layout()
      .setDepth(1);
  }

  reset(): void {
    this.scenarioControl.reset();
    (this.mutationRateSlider.node.children[0] as any).value = 0.05;
    (this.energyLossSlider.node.children[0] as any).value = 1;
    (this.energyPerFoodSlider.node.children[0] as any).value = 50;
    (this.foodSpawnLimitSlider.node.children[0] as any).value = 100;
    (this.foodSpawnRateSlider.node.children[0] as any).value = 1;
  }
}
