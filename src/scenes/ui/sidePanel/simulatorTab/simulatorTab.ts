import { UIScene } from '../../mainUI';
import { TabComponent } from '../tabComponent';
import { ScenarioControl } from './scenarioControl';
import { SimulatorControl } from './simulatorControl';

export class SimulatorTab extends TabComponent {
  private scenarioControl: ScenarioControl;
  private simulatorControl: SimulatorControl;

  constructor(scene: UIScene) {
    super(scene, {
      orientation: 'y',
      space: { left: 20, right: 20, top: 20, bottom: 20, item: 30 },
    });

    this.scenarioControl = new ScenarioControl(scene);
    this.simulatorControl = new SimulatorControl(scene);

    this.add(this.simulatorControl)
      .add(this.scenarioControl)
      .layout()
      .setDepth(1);
  }

  reset(): void {
    this.scenarioControl.reset();
    this.simulatorControl.reset();
  }
}
