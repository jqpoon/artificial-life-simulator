let bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');
type tutorialStep = {
  helpText: string;
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export class Tutorial {
  private steps: tutorialStep[];
  private currentStep: number;

  private instructionText: Phaser.GameObjects.DOMElement;
  private overlay: Phaser.GameObjects.DOMElement;

  constructor(scene: Phaser.Scene) {
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
          data-bs-trigger="click hover"
          data-bs-toggle="tooltip"
          title="hello world"
        ></div>
      </div>
    `);

    this.overlay.setDepth(3);
    this.instructionText.setDepth(4);

    this.setInstructions(`Welcome to Jia's life simulator!
      This tutorial will run through the features of this simulator
      Click anywhere to continue`);

    /* Advance tutorial when clicked */
    let f = () => {
      this.next();
    };

    this.getOverlay().onclick = f;
    this.getInstructionText().onclick = f;

    /* Initialise tutorial steps */
    this.currentStep = 0;
    this.steps = [
      {
        helpText: 'Step 1',
        top: 500,
        bottom: 50,
        left: 50,
        right: 50,
      },
      {
        helpText: 'Step 2',
        top: 700,
        bottom: 100,
        left: 300,
        right: 300,
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
    this.hideInstructionText();
    this.hideOverlay();
  }

  /* Progresses the tutorial */
  private next() {
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
      this.setInstructions(`Thanks for going through the tutorial!
        Click to continue`);
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
