import { Label, Pages } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { UIComponent } from '../UIComponent';
import { COLORS, PAGE_KEYS, smallerTextDark, textDefaultsDark } from '../UIConstants';
import { UIScene } from '../mainUI';
import { GraphTab } from './graphTab/graphTab';
import { OrganismTab } from './organismTab/organismTab';
import { SimulatorTab } from './simulatorTab/simulatorTab';

export class SidePanel extends UIComponent {
  private graphTab: GraphTab;
  private organismTab: OrganismTab;
  private scenarioTab: SimulatorTab;
  private pages: Pages;

  constructor(scene: UIScene) {
    super(scene, {
      x: 1600,
      y: 599,
      height: 1220,
      width: 650,
      orientation: 'y',
    });

    /* Title */
    let titleText = scene.rexUI.add.label({
      text: scene.add.text(0, 0, "Jia's Life Simulator", textDefaultsDark),
      height: 80,
    });

    /* Pages */
    this.organismTab = new OrganismTab(scene);
    this.graphTab = new GraphTab(scene);
    this.scenarioTab = new SimulatorTab(scene);

    this.pages = scene.rexUI.add
      .pages({
        width: 650,
        height: 900,
      })
      .addBackground(
        scene.rexUI.add
          .roundRectangle(0, 0, 10, 10, 0, COLORS.BACKGROUND_COLOR)
          .setStrokeStyle(2, COLORS.BACKGROUND_BORDER)
      );

    this.pages.addPage(this.graphTab, { key: PAGE_KEYS.GRAPHS, expand: true });
    this.pages.addPage(this.organismTab, { key: PAGE_KEYS.ORGANISM, expand: true });
    this.pages.addPage(this.scenarioTab, { key: PAGE_KEYS.SIMULATION, expand: true });
    this.pages.swapPage(PAGE_KEYS.ORGANISM);

    /* Navigation bar */
    let navigationBar = scene.rexUI.add
      .sizer()
      .add(this.createButton(scene, 'Organism\n Controls', PAGE_KEYS.ORGANISM))
      .add(this.createButton(scene, 'Simulation\n Controls', PAGE_KEYS.SIMULATION))
      .add(this.createButton(scene, 'Graphs', PAGE_KEYS.GRAPHS));

    /* Organise UI elements */
    this.add(titleText)
      .add(this.pages)
      .add(navigationBar)
      .addBackground(
        scene.rexUI.add
          .roundRectangle(0, 0, 0, 0, 0, COLORS.OFF_WHITE)
          .setStrokeStyle(2, COLORS.BACKGROUND_BORDER)
          .setDepth(-5)
      )
      .layout();
  }

  reset(): void {
    this.graphTab.reset();
    this.organismTab.reset();
  }

  private createButton(scene: UIScene, text: string, key: PAGE_KEYS): Label {
    return scene.rexUI.add.label({
      width: 200,
      height: 100,
      align: 'center',
      background: scene.rexUI.add
        .roundRectangle(0, 0, 0, 0, 5, COLORS.BUTTON_MAIN)
        .setStrokeStyle(2, COLORS.BUTTON_BORDER),
      text: this.scene.add.text(0, 0, text, smallerTextDark),
      space: { left: 20, right: 20, top: 20, bottom: 20 },
    })
    .setInteractive()
    .on('pointerdown', () => {
      this.pages.swapPage(key);
    });
  }
}
