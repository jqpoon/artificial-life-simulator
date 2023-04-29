import { Buttons } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { UIComponent } from './UIComponent';
import { UIScene } from './mainUI';
import { EVENTS_NAME } from '../../consts';

export class SpeedControls extends UIComponent {
  private buttons: Buttons;

  constructor(scene: UIScene) {
    super(scene, {
      x: 150,
      y: 150,
    });

    this.buttons = scene.rexUI.add.buttons({
      orientation: 'x',
      buttons: [
        this.createButton(scene, 'pause'),
        this.createButton(scene, 'speed1'),
        this.createButton(scene, 'speed2'),
        this.createButton(scene, 'speed3'),
      ],
      space: { item: 8 },
      buttonsType: 'radio',
    });

    this.buttons
      .on('button.statechange', function (button: any, index: any, value: any, previousValue: any) {
        button.getElement('background').setActiveState(value);
      })
      .on('button.over', function (button: any, index: any, pointer: any, event: any) {
        button.getElement('background').setHoverState(true);
      })
      .on('button.out', function (button: any, index: any, pointer: any, event: any) {
        button.getElement('background').setHoverState(false);
      })
      .on('button.click', function(button: any, index: any, pointer: any, event: any) {
        let timeScales = [0, 3, 5, 8];
        scene.game.events.emit(EVENTS_NAME.updateTimeScale, timeScales[index]);
      }
    );

    this.add(this.buttons).layout();

    this.reset();
  }

  reset(): void {
    this.buttons.emitButtonClick(1); // Selects speed 1 by default
  }

  private createButton(
    scene: UIScene,
    image: string
  ) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.statesRoundRectangle({
          radius: 10,

          color: 0xffffff,
          'active.color': 0xcfcfd1,

          strokeWidth: 0,
          'hover.strokeColor': 0x000000,
          'hover.strokeWidth': 2,
        }),
        icon: scene.add.image(0, 0, image),
        iconSize: 40,
        space: { left: 10, right: 10, top: 10, bottom: 10 },
        name: image,
      })
  }
}
