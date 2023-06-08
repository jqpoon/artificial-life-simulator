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

  constructor(scene: UIScene) {
    super(scene, {
      orientation: 'y',
      space: { left: 20, right: 20, top: 20, bottom: 20, item: 30 },
    });

    this.scenarioControl = new ScenarioControl(scene);

    /* Controls global mutation rate */
    let mutationText = scene.add.text(0, 0, '0.5', smallerTextDark);
    this.mutationRateSlider = BootstrapFactory.createSlider(
      scene,
      (e: any) => {
        let value = e.target.value;
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

    /* Controls global energy loss rate */
    let energyLossText = scene.add.text(0, 0, '1', smallerTextDark);
    this.energyLossSlider = BootstrapFactory.createSlider(
      scene,
      (e: any) => {
        let value = e.target.value;
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
      5 // Max
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
      .layout()
      .setDepth(1);
  }

  reset(): void {
    this.scenarioControl.reset();
    (this.energyLossSlider.node.children[0] as any).value = 1;
  }
}
