import { UIComponent } from './UIComponent';
import { UIScene } from './mainUI';
import { EVENTS_NAME } from '../../consts';

export class ScenarioControl extends UIComponent {
  constructor(scene: UIScene) {
    super(scene, {
      x: 605,
      y: 910,
      orientation: 'x',
      space: { item: 20 },
    });

    this.add(
      scene.rexUI.add
        .label({
          width: 100,
          height: 30,
          align: 'center',
          background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x333333),
          text: this.scene.add.text(0, 0, 'Reset'),
          space: { left: 20, right: 20, top: 20, bottom: 20 },
        })
        .setPosition(50, 260)
        .layout()
        .setInteractive()
        .on('pointerdown', () => {
          scene.resetScene();
        })
    )
      .add(
        scene.rexUI.add
          .label({
            background: scene.rexUI.add.roundRectangle(
              0,
              0,
              0,
              0,
              10,
              0x888888
            ),
            text: scene.add.text(0, 0, 'Scenario 1'),
            space: { left: 20, right: 20, top: 20, bottom: 20 },
          })
          .setPosition(50, 200)
          .layout()
          .setInteractive()
          .on('pointerdown', () => {
            scene.resetScene();

            // Weird things happen without this timeout, presumably because
            // the scene reset is slower than loading a scenario...
            setTimeout(() => {
              scene.game.events.emit(EVENTS_NAME.loadScenario, 1);
            }, 50);
          })
      )
      .layout();
  }

  reset(): void {}
}
