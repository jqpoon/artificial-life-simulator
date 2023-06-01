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

      To continue, click on the button below or press space.
      You can also exit the tutorial at any time by pressing escape.`);

    /* Register keystrokes */
    scene.input.keyboard?.on('keydown-' + 'SPACE', () => {
      this.next();
    });

    scene.input.keyboard?.on('keydown-' + 'ESC', () => {
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
          This allows you to customise its size, speed and starting energy.`,
        tooltipDirection: 'left',
        top: 115,
        bottom: 505,
        left: 1285,
        right: 323,
      },
      {
        helpText: `Type refers to the brain type of the organism. Random organisms
          move randomly, vision organisms move towards food when they see it,
          and neural network organisms have a neural network that control their movement.`,
        tooltipDirection: 'left',
        top: 115,
        bottom: 505,
        left: 1285,
        right: 323,
      },
      {
        helpText: `Here you can see information about this organism.
                   Click on an organism to see this information.
                   Remember, you can spawn organisms by clicking on the main canvas.`,
        tooltipDirection: 'left',
        top: 115,
        bottom: 505,
        left: 1600,
        right: 5,
      },
      {
        helpText: `Great job! The energy of an organism goes down over time, but it
                   can eat food to gain energy. If it gains enough energy, it will
                   reproduce with a slight mutation. `,
        tooltipDirection: 'left',
        top: 115,
        bottom: 505,
        left: 1600,
        right: 5,
      },
    ];
  }

  /**
   * Starts the tutorial
   */
  public start() {
    this.showInstructionText();
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
    this.scene.input.keyboard?.off('keydown-SPACE');
    this.scene.input.keyboard?.off('keydown-ESCAPE');
  }

  /* Progresses the tutorial */
  public next() {
    this.deleteAllTooltips();

    /* End of tutorial */
    if (this.currentStep > this.steps.length) {
      this.exit();
      return;
    }

    /* Show ending element if this is the last step */
    if (this.currentStep == this.steps.length) {
      this.hideOverlay();
      this.showInstructionText();
      this.setInstructions(`Thanks for going through the tutorial!`);
      this.currentStep += 1;
      return;
    }

    /* First hide any instructions and show the overlay */
    this.hideInstructionText();
    this.showOverlay();

    /* Then highlight this step's area and show its tool tip*/
    let step = this.steps[this.currentStep];
    this.loadStep(step);
    this.getOverlayTooltipBootstrap().show();

    this.currentStep += 1;
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
