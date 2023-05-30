import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle';

import { EVENTS_NAME } from '../../../../consts';
import { GameObjects } from 'phaser';
import { OrganismInformation } from '../../../../typedefs';
import {
  smallerTextDark,
  textDefaultsDark,
} from '../../common/UIConstants';
import { UIComponent } from '../../common/UIComponent';
import { UIScene } from '../../mainUI';
import { BootstrapFactory } from '../../common/bootstrap/bootstrapFactory';

export class OrganismViewer extends UIComponent {
  private generationText: GameObjects.Text;
  private speedText: GameObjects.Text;
  private sizeText: GameObjects.Text;
  private energyText: GameObjects.Text;
  private infoText: GameObjects.Text;
  private typeText: GameObjects.Text;

  constructor(scene: UIScene) {
    super(scene, {
      x: 180,
      y: 320,
      width: 300,
      height: 400,
      orientation: 'y',
      space: { left: 10, right: 10, top: 10, bottom: 10, item: 20 },
    });

    // Background of information pane
    let background = new RoundRectangle(scene, {
      radius: 10,
      color: 0xe9e9ed,
      strokeColor: 0x8f8f9c,
    }).setDepth(-1);
    scene.add.existing(background);

    // Information to be updated
    this.generationText = scene.add.text(0, 0, '0', smallerTextDark);
    this.speedText = scene.add.text(0, 0, '0.0', smallerTextDark);
    this.sizeText = scene.add.text(0, 0, '0.0', smallerTextDark);
    this.energyText = scene.add.text(0, 0, '0.0', smallerTextDark);
    this.typeText = scene.add.text(0, 0, 'Undefined', smallerTextDark);
    this.infoText = scene.add.text(
      0,
      0,
      'Click on an organism!',
      smallerTextDark
    );

    // Unselect organism button
    let unselectButton = BootstrapFactory.createButton(
      scene,
      'Unselect',
      (e: any) => {
        this.scene.game.events.emit(EVENTS_NAME.selectOrganism, {
          name: 'unselect',
        });
      },
      this
    );

    this.add(scene.add.text(0, 0, 'Organism Info', textDefaultsDark))
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x' })
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 10 } })
              .add(scene.add.text(0, 0, 'Generation: ', smallerTextDark), {
                align: 'left',
              })
              .add(scene.add.text(0, 0, 'Speed: ', smallerTextDark), {
                align: 'left',
              })
              .add(scene.add.text(0, 0, 'Size: ', smallerTextDark), {
                align: 'left',
              })
              .add(scene.add.text(0, 0, 'Energy: ', smallerTextDark), {
                align: 'left',
              })
              .add(scene.add.text(0, 0, 'Type: ', smallerTextDark), {
                align: 'left',
              })
          )
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 10 } })
              .add(this.generationText)
              .add(this.speedText)
              .add(this.sizeText)
              .add(this.energyText)
              .add(this.typeText)
          )
      )
      .add(this.infoText)
      .add(unselectButton);

    this.addBackground(background).layout();

    // Update text based on event
    scene.game.events.on(
      EVENTS_NAME.selectOrganism,
      (info: OrganismInformation) => {
        if (info.name == 'unselect') {
          // If no info is available, then just reset
          this.reset();
        } else {
          this.updateInformation(
            info.generation,
            info.velocity,
            info.size,
            info.energy,
            info.type
          );
        }
      }
    );
  }

  reset(): void {
    this.speedText.setText('0.0');
    this.sizeText.setText('0.0');
    this.energyText.setText('0.0');
    this.infoText.setText('Click on an organism!');
  }

  private updateInformation(
    generation: number,
    speed: number,
    size: number,
    energy: number,
    type: string
  ): void {
    this.generationText.setText(
      generation.toLocaleString('en-us', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    );
    this.speedText.setText(
      speed.toLocaleString('en-us', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
    );
    this.sizeText.setText(
      size.toLocaleString('en-us', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
    );
    this.energyText.setText(
      energy.toLocaleString('en-us', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
    );
    this.typeText.setText(type);

    if (energy <= 0) {
      this.infoText.setText('Click on an organism!');
    } else {
      this.infoText.setText('Tracking organism...');
    }
  }
}
