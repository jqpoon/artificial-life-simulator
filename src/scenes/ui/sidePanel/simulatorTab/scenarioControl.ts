import { EVENTS_NAME } from '../../../../consts';
import { UIComponent } from '../../common/UIComponent';
import { UIScene } from '../../mainUI';
import { BootstrapFactory } from '../../common/bootstrapFactory';
import { RoundRectangle } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { COLORS, smallerTextDark, textDefaultsDark } from '../../common/UIConstants';

const scenarioDescriptions = [
  'A default, blank canvas.',
  'Scenario 1',
  'Scenario 2'
];

export class ScenarioControl extends UIComponent {
  private selectedScenario: number = 0;
  private scenarioDropdown: any;
  private scenarioDescription: Phaser.GameObjects.Text;

  constructor(scene: UIScene) {
    super(scene, {
      x: 180,
      y: 700,
      width: 600,
      height: 400,
      orientation: 'y',
      space: { left: 10, right: 10, top: 10, bottom: 10, item: 20 },
    });

    let background: RoundRectangle = new RoundRectangle(scene, {
      radius: 10,
      color: COLORS.CARD_GREY,
      strokeColor: 0x8f8f9c,
    }).setDepth(-1);
    scene.add.existing(background);

    /* Text at the top of the card */
    let cardText = scene.rexUI.add.label({
      text: scene.add.text(0, 0, 'Scenarios', textDefaultsDark),
      height: 80,
    });

    /* Scenario selector */
    this.scenarioDropdown = BootstrapFactory.createDropdown(
      scene,
      (e: any) => {
        let selectedIndex = parseInt(e.target.value)
        this.selectedScenario = selectedIndex;
        this.scenarioDescription.setText(scenarioDescriptions[selectedIndex])
      },
      this,
      [
        { displayText: 'No scenario', value: 0 },
        { displayText: 'Big vs Small', value: 1 },
        { displayText: 'Battle of Brains', value: 2 },
        { displayText: 'Neuro Evolution', value: 3 },
      ]
    );

    /* Scenario description */
    this.scenarioDescription = scene.add.text(0, 0, scenarioDescriptions[0], smallerTextDark);

    /* Bar containing dropdown selection and loading button */
    let topBar = scene.rexUI.add
      .sizer({ space: { item: 60 } })
      .add(this.scenarioDropdown)
      .add(
        BootstrapFactory.createButton(
          scene,
          'Load',
          () => {
            scene.resetScene();

            // Weird things happen without this timeout, presumably because
            // the scene reset is slower than loading a scenario...
            setTimeout(() => {
              scene.game.events.emit(
                EVENTS_NAME.loadScenario,
                this.selectedScenario
              );
            }, 100);
          },
          this
        )
      );

    /* Bar containing preview of scenario and a short description */
    let bottomBar = scene.rexUI.add
      .sizer({ space: { item: 60 } })
      .add(this.scenarioDescription);

    this.add(cardText)
      .add(topBar)
      .add(bottomBar)
      .addBackground(background)
      .layout();
  }

  reset(): void {}
}
