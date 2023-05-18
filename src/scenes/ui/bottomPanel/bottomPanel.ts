import { UIComponent } from '../UIComponent';
import { UIScene } from '../mainUI';
import { ScenarioControl } from './scenarioControl';
import { SpeedControls } from './speedControls';

export class BottomPanel extends UIComponent {
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

    this.add(this.scenarioControl).add(this.speedControls).layout();
  }

  reset(): void {
    this.scenarioControl.reset();
    this.speedControls.reset();
  }
}
