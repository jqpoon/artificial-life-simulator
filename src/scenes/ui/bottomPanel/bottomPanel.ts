import { UIComponent } from '../common/UIComponent';
import { UIScene } from '../mainUI';
import { SpeedControls } from './speedControls';

export class BottomPanel extends UIComponent {
  private speedControls: SpeedControls;

  constructor(scene: UIScene) {
    super(scene, {
      x: 600,
      y: 1000,
      orientation: 'x',
      space: { left: 20, right: 20, top: 20, bottom: 20, item: 30 },
    });

    this.speedControls = new SpeedControls(scene);

    this.add(this.speedControls).layout();
  }

  reset(): void {
    this.speedControls.reset();
  }
}
