import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle';

import { EVENTS_NAME } from '../../../../consts';
import { GameObjects } from 'phaser';
import { OrganismInformation } from '../../../../typedefs';
import { smallerTextDark, textDefaultsDark } from '../../common/UIConstants';
import { UIComponent } from '../../common/UIComponent';
import { UIScene } from '../../mainUI';
import { BootstrapFactory } from '../../common/bootstrapFactory';
import { OrganismBrain } from './organismBrain';

export class OrganismViewer extends UIComponent {
  private generationText: GameObjects.Text;
  private speedText: GameObjects.Text;
  private sizeText: GameObjects.Text;
  private energyText: GameObjects.Text;
  private infoText: GameObjects.Text;
  private organismBrain: OrganismBrain;

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

    let killButton = BootstrapFactory.createButton(
      scene,
      'Kill',
      (e: any) => {
        this.scene.game.events.emit(EVENTS_NAME.killSelectedOrganism);
        this.scene.game.events.emit(EVENTS_NAME.selectOrganism, {
          name: 'unselect',
        });
      },
      this
    );

    // Organism brain, i.e. what it is thinking
    this.organismBrain = new OrganismBrain(scene);

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
          )
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 10 } })
              .add(this.generationText)
              .add(this.speedText)
              .add(this.sizeText)
              .add(this.energyText)
          )
      )
      .add(this.infoText)
      .add(unselectButton)
      .add(killButton)
      .add(this.organismBrain);

    this.addBackground(background).layout();

    // Update text based on event
    scene.game.events.on(
      EVENTS_NAME.selectOrganism,
      (info: OrganismInformation) => {
        if (info.name == 'unselect') {
          // If no info is available, then just reset
          this.reset();
        } else {
          this.updateInformation(info);
        }
      }
    );
  }

  reset(): void {
    this.speedText.setText('0.0');
    this.sizeText.setText('0.0');
    this.energyText.setText('0.0');
    this.infoText.setText('Click on an organism!');
    this.organismBrain.reset();
  }

  private updateInformation(info: OrganismInformation): void {
    this.generationText.setText(
      info.generation.toLocaleString('en-us', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    );
    this.speedText.setText(
      info.velocity.toLocaleString('en-us', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
    );
    this.sizeText.setText(
      info.size.toLocaleString('en-us', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
    );
    this.energyText.setText(
      info.energy.toLocaleString('en-us', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
    );

    this.organismBrain.setOrganismColor(info.color);
    this.organismBrain.setCenterText(info.type);
    this.organismBrain.setArrowDirection(info.brainDirectionInfo ?? [0, 0, 0, 0, 0, 0, 0, 0,]);

    if (info.energy <= 0) {
      this.reset();
    } else {
      this.infoText.setText('Tracking organism...');
    }
  }
}
