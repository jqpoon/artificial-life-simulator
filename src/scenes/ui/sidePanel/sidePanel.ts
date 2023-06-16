import { Label, Pages } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { UIComponent } from '../common/UIComponent';
import {
  COLORS,
  PAGE_KEYS,
  smallerTextDark,
  textDefaultsDark,
} from '../common/UIConstants';
import { UIScene } from '../mainUI';
import { GraphTab } from './graphTab/graphTab';
import { OrganismTab } from './organismTab/organismTab';
import { SimulatorTab } from './simulatorTab/simulatorTab';
import { BootstrapFactory } from '../common/bootstrapFactory';

export class SidePanel extends UIComponent {
  private graphTab: GraphTab;
  private organismTab: OrganismTab;
  private scenarioTab: SimulatorTab;
  private pages: Pages;

  constructor(scene: UIScene) {
    super(scene, {
      x: 1600,
      y: 1080 / 2,
      height: 1080,
      width: 500,
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
    this.pages.addPage(this.organismTab, {
      key: PAGE_KEYS.ORGANISM,
      expand: true,
    });
    this.pages.addPage(this.scenarioTab, {
      key: PAGE_KEYS.SIMULATION,
      expand: true,
    });
    this.pages.swapPage(PAGE_KEYS.ORGANISM);
    this.enableTooltips();

    /* Navigation bar */
    let navigationBar = BootstrapFactory.createTabs(
      scene,
      [
        { displayText: 'Organism Controls', value: PAGE_KEYS.ORGANISM },
        { displayText: 'Simulation Controls', value: PAGE_KEYS.SIMULATION },
        { displayText: 'Graphs', value: PAGE_KEYS.GRAPHS },
      ],
      (e: any) => {
        // Oh god this is really hacky but I'm tired of doing UI
        e.target.parentElement.children[0].classList.remove('active');
        e.target.parentElement.children[1].classList.remove('active');
        e.target.parentElement.children[2].classList.remove('active');
        e.target.classList.add('active');

        this.pages.swapPage(e.target.value);
      },
      this
    );

    /* Organise UI elements */
    this.add(titleText, { proportion: 1 })
      .add(this.pages, { proportion: 9 })
      .add(navigationBar, { proportion: 0.9, align: 'top', expand: true })
      .addBackground(
        scene.rexUI.add
          .roundRectangle(0, 0, 0, 0, 0, COLORS.CARD_GREY)
          .setStrokeStyle(2, COLORS.BACKGROUND_BORDER)
          .setDepth(-5)
      )
      .layout();
  }

  reset(): void {
    this.graphTab.reset();
    this.organismTab.reset();
    this.scenarioTab.reset();
  }

  /* Enables tooltips as created by bootstrap */
  private enableTooltips(): void {
    let bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
}
