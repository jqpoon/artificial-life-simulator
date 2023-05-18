import { Slider } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { UIComponent } from '../UIComponent';
import { UIScene } from '../mainUI';
import { ScenarioControl } from './scenarioControl';
import { SpeedControls } from './speedControls';
import { REGISTRY_KEYS } from '../../../consts';
import { smallerTextDark } from '../UIConstants';

export class BottomPanel extends UIComponent {
  private mutationRateSlider: Slider;
  private scenarioControl: ScenarioControl;
  private speedControls: SpeedControls;

  constructor(scene: UIScene) {
    super(scene, {
      x: 600,
      y: 1000,
      orientation: 'x',
      space: { left: 20, right: 20, top: 20, bottom: 20, item: 30 },
    });

    this.scenarioControl = new ScenarioControl(scene);
    this.speedControls = new SpeedControls(scene);

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

    this.add(this.scenarioControl)
      .add(this.speedControls)
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x', space: { item: 20 } })
          .add(scene.add.text(0, 0, 'Mutation Rate', smallerTextDark))
          .add(this.mutationRateSlider)
          .add(mutationText)
      )
      .layout();
  }

  reset(): void {
    this.scenarioControl.reset();
    this.speedControls.reset();
  }
}
