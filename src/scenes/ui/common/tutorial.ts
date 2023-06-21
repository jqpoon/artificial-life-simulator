import { BootstrapFactory } from './bootstrapFactory';

let bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');
type tutorialStep = {
  helpText: string;
  tooltipDirection: string;
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export class Tutorial {
  private scene: Phaser.Scene;
  private steps: tutorialStep[];
  private currentStep: number;

  private instructionText: Phaser.GameObjects.DOMElement;
  private overlay: Phaser.GameObjects.DOMElement;
  private nextButton: Phaser.GameObjects.DOMElement;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    /* Create instruction and overlay elements */
    this.instructionText = scene.add.dom(0, 0).createFromHTML(`
      <div
        id="instruction-text-div"
        style="
          visibility: hidden;
          position: absolute;
          background-color:rgba(0, 0, 0, 0.5);
          width: 1920px;
          height: 1080px;
          display: flex;
          justify-content: center;
          align-content: center;
          flex-direction: column;
          pointer-events: none;
        ">
          <p
            id="instruction-text"
            class="text-center fs-3 bg-light border border-3"
            style="margin: auto; width: 50%"
          >
          </p>
      </div>
    `);

    this.overlay = scene.add.dom(0, 0).createFromHTML(`
      <div
        id="spotlight"
        style="
          opacity: 0.6;
          z-index: 5;
          width: 1920px;
          height: 1080px;
          position: absolute;
          box-sizing: border-box;
          visibility: hidden;
          pointer-events: none;
        "
      >
        <div
          id="spotlight-tooltip"
          data-bs-trigger="manual"
          data-bs-toggle="tooltip"
          title="hello world"
          style="
            width: 100%;
            height: 100%;
          "
        ></div>
      </div>
    `);

    this.nextButton = BootstrapFactory.createButton(
      scene,
      'Next',
      () => {
        this.next();
      },
      this,
      960,
      1000
    );

    this.nextButton.setDepth(4);
    this.overlay.setDepth(3);
    this.instructionText.setDepth(3);

    this.setInstructions(`Welcome to Jia's life simulator!
      This tutorial will run through the features of this simulator.

      To continue, click on the button below or press the right arrow key.
      You can also exit the tutorial at any time by pressing escape.`);

    /* Register keystrokes */
    let right = scene.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    let esc = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    let left = scene.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    right?.on('down', () => {
      this.next();
    });
    // left?.on('down', () => {
    //   this.prev();
    // });
    esc?.on('down', () => {
      this.exit();
    });

    /* Initialise tutorial steps */
    this.currentStep = 0;
    this.steps = [
      {
        helpText: `This is the main simulation screen. Organisms (big circles) move
           around freely in this continuous environment, trying to eat food
           (small green dots). Clicking anywhere on this screen will spawn a new organism. Try it!`,
        tooltipDirection: 'right',
        top: 35,
        bottom: 135,
        left: 15,
        right: 695,
      },
      {
        helpText: `Great job! The organism you just created is now moving and exploring the world.`,
        tooltipDirection: 'right',
        top: 35,
        bottom: 135,
        left: 15,
        right: 695,
      },
      {
        helpText: `You can control the simulator speed here by clicking on these buttons.
                   To pause/unpause, you can also use the spacebar.`,
        tooltipDirection: 'top',
        top: 960,
        bottom: 40,
        left: 470,
        right: 1170,
      },
      {
        helpText: `This is the controls panel. You can change simulator settings,
          look at organism information and look at population graphs here.`,
        tooltipDirection: 'left',
        top: 0,
        bottom: 0,
        left: 1275,
        right: 0,
      },
      {
        helpText: `The first tab is the Organisms tab. Here, you can design your own
          organism and look at statistics of your organism.`,
        tooltipDirection: 'left',
        top: 100,
        bottom: 90,
        left: 1275,
        right: 0,
      },
      {
        helpText: `This is the organism builder. Remember spawning your own organism earlier?
          This allows you to customise its size, speed, vision radius and starting energy.`,
        tooltipDirection: 'left',
        top: 110,
        bottom: 545,
        left: 1285,
        right: 5,
      },
      {
        helpText: `Type refers to the brain type of the organism. Random organisms
          move randomly, vision organisms move towards food when they see it,
          and neural network organisms have a neural network that control their movement.`,
        tooltipDirection: 'left',
        top: 110,
        bottom: 545,
        left: 1285,
        right: 5,
      },
      {
        helpText: `The colour of an organism determines its species. Each colour represents
          a single species and this is reflected on the graph.`,
        tooltipDirection: 'left',
        top: 110,
        bottom: 545,
        left: 1285,
        right: 5,
      },
      {
        helpText: `Here you can see information about this organism.
                   Click on an organism to see this information.
                   (Remember, you can spawn organisms by clicking on the main canvas.)`,
        tooltipDirection: 'left',
        top: 535,
        bottom: 90,
        left: 1285,
        right: 5,
      },
      {
        helpText: `Great job! The energy of an organism goes down over time, but it
                   can eat food to gain energy. If it gains enough energy, it will
                   reproduce with a slight mutation. `,
        tooltipDirection: 'left',
        top: 535,
        bottom: 90,
        left: 1285,
        right: 5,
      },
      {
        helpText: `This represents the 'brain' of an organism. The arrows in each
          direction show what the organism will do if food is in that direction.
          For example, the 12'o clock, arrow shows what this organism will do
          if there is food to its north. `,
        tooltipDirection: 'left',
        top: 600,
        bottom: 165,
        left: 1550,
        right: 50,
      },
      {
        helpText: `These buttons allow you to take actions on the organism
          you have selected.`,
        tooltipDirection: 'left',
        top: 910,
        bottom: 100,
        left: 1350,
        right: 50,
      },
      {
        helpText: `Click here to go to the next tab, simulation controls.`,
        tooltipDirection: 'top',
        top: 990,
        bottom: 0,
        left: 1490,
        right: 210,
      },
      {
        helpText: `Here, you can control simulation-wide parameters. These affect
          all organisms.`,
        tooltipDirection: 'left',
        top: 110,
        bottom: 545,
        left: 1285,
        right: 5,
      },
      {
        helpText: `These toggles control whether mutation is turned on for certain attributes.`,
        tooltipDirection: 'left',
        top: 410,
        bottom: 560,
        left: 1305,
        right: 25,
      },
      {
        helpText: `Scenarios are an easy way to get started! Load a scenario to
          explore different organisms in the simulator.`,
        tooltipDirection: 'left',
        top: 535,
        bottom: 90,
        left: 1285,
        right: 5,
      },
      {
        helpText: `Click here to access the graphs tab.`,
        tooltipDirection: 'left',
        top: 990,
        bottom: 0,
        left: 1710,
        right: 0,
      },
      {
        helpText: `Here, you can see how to population of organisms change over time.
          Each colour is tied to a single species, regardless of how their colour mutates.`,
        tooltipDirection: 'left',
        top: 100,
        bottom: 90,
        left: 1275,
        right: 0,
      },
    ];

    this.start();
  }

  /**
   * Starts the tutorial
   */
  public start() {
    this.currentStep = 0;
    this.showInstructionText();
    this.hideOverlay();
    this.deleteAllTooltips();
  }

  /**
   * Ends the tutorial
   */
  public exit() {
    this.currentStep = 0;
    this.deleteAllTooltips();
    this.hideInstructionText();
    this.hideOverlay();
    this.nextButton.destroy();

    /* Destroy keyboard inputs */
    this.scene.input.keyboard?.removeKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.scene.input.keyboard?.removeKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  /* Progresses the tutorial */
  public next() {
    this.step(1);
  }

  /* Goes back in the tutorial */
  public prev() {
    this.step(-1);
  }

  /* Progresses or goes back in the tutorial. numSteps can be negative. */
  private step(numSteps: number) {
    this.deleteAllTooltips();

    /* Back to start of tutorial*/
    if (this.currentStep < -1) {
      this.start();
      return;
    }

    /* End of tutorial */
    if (this.currentStep > this.steps.length) {
      this.currentStep = 0;
      this.exit();
      return;
    }

    /* Show ending element if this is the last step */
    if (this.currentStep == this.steps.length) {
      this.hideOverlay();
      this.showInstructionText();
      this.setInstructions(`Thanks for going through the tutorial. If you want
          go through it again, click on the button in the bottom right.
          Enjoy!`);
      this.currentStep += numSteps;
      return;
    }

    /* First hide any instructions and show the overlay */
    this.hideInstructionText();
    this.showOverlay();

    /* Then highlight this step's area and show its tool tip*/
    let step = this.steps[this.currentStep];
    this.loadStep(step);
    this.getOverlayTooltipBootstrap().show();

    this.currentStep += numSteps;
  }

  private loadStep(step: tutorialStep) {
    /* Set coordinates of highlight box */
    let overlay = this.getOverlay();
    overlay.style['border-top'] = `${step.top}px solid black`;
    overlay.style['border-bottom'] = `${step.bottom}px solid black`;
    overlay.style['border-left'] = `${step.left}px solid black`;
    overlay.style['border-right'] = `${step.right}px solid black`;

    /* Set tooltip help text */
    let tooltip = this.getOverlayTooltip();
    tooltip?.setAttribute('title', step.helpText);

    /* Set tooltip direction */
    tooltip?.setAttribute('data-bs-placement', `${step.tooltipDirection}`);
  }

  /** Deletes all tooltips. For some reason using the bootstrap method of
   * removing tooltips doesn't work
   */
  private deleteAllTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[role="tooltip"]');
    [...tooltipTriggerList].map((tooltipTriggerEl) => {
      tooltipTriggerEl.parentNode?.removeChild(tooltipTriggerEl);
    });
  }

  /* Sets instruction text */
  private setInstructions(text: string) {
    let instructionText = document.querySelector('#instruction-text') as any;
    instructionText.innerText = text;
  }

  /* Retrieve the instruction text div */
  private getInstructionText() {
    return document.querySelector('#instruction-text-div') as any;
  }

  /* Retrieve overlay div */
  private getOverlay() {
    return document.querySelector('#spotlight') as any;
  }

  /* Retrieve the div element within the overlay div that is tooltip enabled */
  private getOverlayTooltip() {
    return document.querySelector('#spotlight-tooltip');
  }

  /* Retrieve the bootstrap tooltip object */
  private getOverlayTooltipBootstrap() {
    return new bootstrap.Tooltip(this.getOverlayTooltip());
  }

  private showOverlay() {
    this.getOverlay().style.visibility = 'visible';
  }

  private hideOverlay() {
    this.getOverlay().style.visibility = 'hidden';
  }

  private showInstructionText() {
    this.getInstructionText().style.visibility = 'visible';
  }

  private hideInstructionText() {
    this.getInstructionText().style.visibility = 'hidden';
  }
}
