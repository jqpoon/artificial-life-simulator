import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle';

import { UIComponent } from './UIComponent';
import { UIScene } from './mainUI';
import { GameObjects } from 'phaser';
import { smallerText, textDefaults } from './UIConstants';
import { EVENTS_NAME } from '../../consts';
import { Organism } from '../../classes/entities/organism';

export class OrganismViewer extends UIComponent {
  private speedText: GameObjects.Text;
  private sizeText: GameObjects.Text;
  private energyText: GameObjects.Text;
  private infoText: GameObjects.Text;

  constructor(scene: UIScene) {
    super(scene, {
      x: 180,
      y: 300,
      width: 270,
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
    this.speedText = scene.add.text(0, 0, '0.0', smallerText);
    this.sizeText = scene.add.text(0, 0, '0.0', smallerText);
    this.energyText = scene.add.text(0, 0, '0.0', smallerText);
    this.infoText = scene.add.text(0, 0, 'Click on an organism!', smallerText);

    this.add(scene.add.text(0, 0, 'Organism Information', textDefaults))
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x' })
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 10 } })
              .add(scene.add.text(0, 0, 'Speed: ', smallerText))
              .add(scene.add.text(0, 0, 'Size: ', smallerText))
              .add(scene.add.text(0, 0, 'Energy: ', smallerText))
          )
          .add(
            scene.rexUI.add
              .sizer({ orientation: 'y', space: { item: 10 } })
              .add(this.speedText)
              .add(this.sizeText)
              .add(this.energyText)
          )
      )
      .add(this.infoText);

    this.addBackground(background).layout();

    // Update text based on event
    scene.game.events.on(EVENTS_NAME.selectOrganism, (organism: Organism) => {
      this.updateInformation(organism.velocity, organism.width, organism.energy);
    });
  }

  reset(): void {
    this.speedText.setText('0.0');
    this.sizeText.setText('0.0');
    this.energyText.setText('0.0');
    this.infoText.setText('Click on an organism!');
  }

  private updateInformation(speed: number, size: number, energy: number): void {
    this.speedText.setText(
      speed.toLocaleString('en-us', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    );
    this.sizeText.setText(
      size.toLocaleString('en-us', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    );
    this.energyText.setText(
      energy.toLocaleString('en-us', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    );

    if (energy <= 0) {
      this.infoText.setText('Click on an organism!');
    } else {
      this.infoText.setText('Tracking organism...');
    }
  }
}
