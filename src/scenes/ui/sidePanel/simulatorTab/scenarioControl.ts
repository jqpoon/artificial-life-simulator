import { EVENTS_NAME } from '../../../../consts';
import { UIComponent } from '../../common/UIComponent';
import { UIScene } from '../../mainUI';
import { BootstrapFactory } from '../../common/bootstrapFactory';

export class ScenarioControl extends UIComponent {
  constructor(scene: UIScene) {
    super(scene, {
      x: 605,
      y: 910,
      orientation: 'x',
      space: { item: 40 },
    });

    this.add(
      BootstrapFactory.createButton(
        scene,
        'Reset',
        () => {
          scene.resetScene();
        },
        this
      )
    )
      .add(
        BootstrapFactory.createButton(
          scene,
          'Scenario 1',
          () => {
            scene.resetScene();

            // Weird things happen without this timeout, presumably because
            // the scene reset is slower than loading a scenario...
            setTimeout(() => {
              scene.game.events.emit(EVENTS_NAME.loadScenario, 1);
            }, 50);
          },
          this
        )
      )
      .add(
        BootstrapFactory.createButton(
          scene,
          'Scenario 2',
          () => {
            scene.resetScene();

            // Weird things happen without this timeout, presumably because
            // the scene reset is slower than loading a scenario...
            setTimeout(() => {
              scene.game.events.emit(EVENTS_NAME.loadScenario, 2);
            }, 50);
          },
          this
        )
      )
      .layout();
  }

  reset(): void {}
}
