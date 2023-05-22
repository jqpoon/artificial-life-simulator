import { Slider } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { UIScene } from '../../mainUI';
import { TabComponent } from '../tabComponent';
import { ScenarioControl } from '../../bottomPanel/scenarioControl';

export class ScenarioTab extends TabComponent {
  private scenarioControl: ScenarioControl;

  constructor(scene: UIScene) {
    super(scene, {
      orientation: 'y',
      space: { left: 20, right: 20, top: 20, bottom: 20, item: 30 },
    });

    this.scenarioControl = new ScenarioControl(scene);
  }

  reset(): void {
    throw new Error('Method not implemented.');
  }
}
