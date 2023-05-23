import { Slider } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { UIScene } from '../../mainUI';
import { TabComponent } from '../tabComponent';
import { ScenarioControl } from '../../bottomPanel/scenarioControl';
import { smallerTextDark } from '../../UIConstants';
import { REGISTRY_KEYS } from '../../../../consts';

export class SimulatorTab extends TabComponent {
  private scenarioControl: ScenarioControl;
  private mutationRateSlider: Slider;
  private energyLossSlider: Slider;

  constructor(scene: UIScene) {
    super(scene, {
      orientation: 'y',
      space: { left: 20, right: 20, top: 20, bottom: 20, item: 30 },
    });

    this.scenarioControl = new ScenarioControl(scene);

    /* Controls global mutation rate */
    let mutationText = scene.add.text(0, 0, '0.5', smallerTextDark);
    this.mutationRateSlider = scene.rexUI.add.slider({
      width: 100,
      height: 10,
      valuechangeCallback: (value) => {
        scene.registry.set(REGISTRY_KEYS.mutationRate, value);
        mutationText.setText(
          value.toLocaleString('en-us', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })
        );
      },
      input: 'click',
      space: { top: 4, bottom: 4 },
      value: 0.5,
      track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 6, 0x000000),
      thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x8f8f9c),
    });

    /* Controls global energy loss rate */
    let energyLossText = scene.add.text(0, 0, '0.5', smallerTextDark);
    this.energyLossSlider = scene.rexUI.add.slider({
      width: 100,
      height: 10,
      valuechangeCallback: (value) => {
        scene.registry.set(REGISTRY_KEYS.energyLoss, (value * 2));
        energyLossText.setText(
          (value * 2).toLocaleString('en-us', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })
        );
      },
      input: 'click',
      space: { top: 4, bottom: 4 },
      value: 0.5,
      track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 6, 0x000000),
      thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x8f8f9c),
    });

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
  }
}
