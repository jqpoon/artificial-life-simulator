import { UIComponent } from '../common/UIComponent';
import { BootstrapFactory } from '../common/bootstrapFactory';
import { Tutorial } from '../common/tutorial';
import { UIScene } from '../mainUI';
import { SpeedControls } from './speedControls';

export class BottomPanel extends UIComponent {
  private speedControls: SpeedControls;

  constructor(scene: UIScene) {
    super(scene, {
      x: 600,
      y: 1000,
      orientation: 'x',
      anchor: {left: 'left'},
      space: { left: 30, right: 20, top: 20, bottom: 20, item: 350 },
    });

    this.speedControls = new SpeedControls(scene);
    let tutorialButton = BootstrapFactory.createButton(
      scene,
      'Start tutorial',
      () => {
        let tutorial = new Tutorial(scene);
        tutorial.start();
      },
      this
    );

    this.add(tutorialButton).add(this.speedControls).layout();
  }

  reset(): void {
    this.speedControls.reset();
  }
}
