import { Buttons } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { EVENTS_NAME } from '../../../consts';
import { UIComponent } from '../common/UIComponent';
import { UIScene } from '../mainUI';

export class SpeedControls extends UIComponent {
  private buttons: Buttons;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private currentButton: number = -1;
  private previousButton: number = -1;

  constructor(scene: UIScene) {
    super(scene, {
      x: 615,
      y: 1000,
    });

    this.buttons = scene.rexUI.add.buttons({
      orientation: 'x',
      buttons: [
        this.createButton(scene, 'pause'),
        this.createButton(scene, 'speed1'),
        this.createButton(scene, 'speed2'),
        this.createButton(scene, 'speed3'),
      ],
      buttonsType: 'radio',
    });

    this.buttons
      .on(
        'button.statechange',
        function (button: any, index: any, value: any, previousValue: any) {
          button.getElement('background').setActiveState(value);
        }
      )
      .on(
        'button.over',
        (button: any, index: any, pointer: any, event: any) => {
          button.getElement('background').setHoverState(true);
        }
      )
      .on('button.out', (button: any, index: any, pointer: any, event: any) => {
        button.getElement('background').setHoverState(false);
      })
      .on(
        'button.click',
        (button: any, index: any, pointer: any, event: any) => {
          let timeScales = [0, 3, 10, 30];
          scene.game.events.emit(
            EVENTS_NAME.updateTimeScale,
            timeScales[index]
          );
          this.currentButton = index;
        },
        this
      );

    if (scene.input.keyboard) {
      this.cursorKeys = scene.input.keyboard.createCursorKeys();
    }

    /* Pause game */
    this.cursorKeys.space.on('down', () => {
      /* If already paused, then resume with previous timescale */
      if (this.currentButton == 0) {
        this.buttons.emitButtonClick(this.previousButton);
        this.currentButton = this.previousButton;
        this.previousButton = 0;
      } else {
        /* Else we just pause the game, saving the current timescale */
        this.previousButton = this.currentButton;
        this.buttons.emitButtonClick(0);
        this.currentButton = 0;
      }
    });

    this.add(this.buttons).layout();

    this.reset();
  }

  reset(): void {
    this.buttons.emitButtonClick(1); // Selects speed 1 by default
  }

  private createButton(scene: UIScene, image: string) {
    return scene.rexUI.add.label({
      background: scene.rexUI.add.statesRoundRectangle({
        radius: 5,

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
    });
  }
}
