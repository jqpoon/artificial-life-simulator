type DropdownOption = { displayText: string; value: any };
type DropdownOptions = DropdownOption[];

/**
 * Generates a random UUID that IS NOT cryptographically sound but good enough
 * @returns
 */
let quickUUID = () => {
  return Math.random().toString(36).substring(2, 15);
};

export class BootstrapFactory {
  /* Common function to create a DOM element and add a click listener */
  private static createDOMElement(
    scene: Phaser.Scene,
    callbackFn: (e: any) => void,
    context: any,
    htmlString: string
  ) {
    /* Add functionality */
    let element = scene.add.dom(0, 0).createFromHTML(htmlString);
    element.addListener('click');
    element.on('click', callbackFn, context);

    return element;
  }

  /**
   * Creates a new dropdown menu using bootstrap
   *
   * @param scene Phaser scene to add this component to
   * @param callbackFn Function to call when this element is clicked
   * @param context Context of callback function
   * @param options List containing dictionaries with displayText and value properties
   *                e.g. [ { displayText: 'Text', value: 1234 } ]
   * @returns A dropdown menu DOM object
   */
  public static createDropdown(
    scene: Phaser.Scene,
    callbackFn: (e: any) => void,
    context: any,
    options: DropdownOptions
  ) {
    let htmlString = `<select class="form-select form-select-lg mb-3">
    `;

    for (let option of options) {
      htmlString += `<option value="${option.value}">${option.displayText}</option>`;
    }

    htmlString += `</select>`;

    return BootstrapFactory.createDOMElement(
      scene,
      callbackFn,
      context,
      htmlString
    );
  }

  /**
   * Creates a new slider using bootstrap. This slider will have 100 discrete
   * steps between min and max, which default to 0 and 100 respectively
   *
   * @param scene Phaser scene to add this component to
   * @param callbackFn Function to call when this element is clicked
   * @param context Context of callback function
   * @param min Optional, sets the minimum of this slider
   * @param max Optional, sets the maximum of this slider
   * @returns A slider DOM object
   */
  public static createSlider(
    scene: Phaser.Scene,
    callbackFn: (e: any) => void,
    context: any,
    min: number = 0,
    max: number = 100
  ) {
    let htmlString = `<input type="range" style="margin: auto; display: block;" class="form-range w-50" min="${min}" max="${max}" step="${
      (max + min) / 100
    }"
    form-range-track-bg="$gray-500"
    >`;

    let element = BootstrapFactory.createDOMElement(
      scene,
      callbackFn,
      context,
      htmlString
    );

    /* Add additional listener to update values while slider is being dragged, not just at the end of dragging */
    element.addListener('input');
    element.on('input', callbackFn, context);

    return element;
  }

  /**
   * Creates an (i) icon that displays text when it is moused-over
   *
   * @param scene Phaser scene to add this component to
   * @param helpText Help text to display
   * @returns An icon DOM object
   */
  public static createHelpIcon(scene: Phaser.Scene, helpText: string) {
    let id = quickUUID();
    let htmlString = `<button type="button" class="btn" data-bs-trigger="hover" data-bs-toggle="tooltip" title="${helpText}" id="${id}">
      <i class="bi bi-info-circle" style="font-size:24px;"></i>
      </button>
      `;

    return BootstrapFactory.createDOMElement(scene, () => {}, null, htmlString);
  }

  /**
   * Creates a boostrap button
   *
   * @param scene Phaser scene to add this component to
   * @param buttonText Text to display on the button
   * @param callbackFn Function to call when this element is clicked
   * @param context Context of callback function
   * @returns A buttom DOM element
   */
  public static createButton(
    scene: Phaser.Scene,
    buttonText: string,
    callbackFn: (e: any) => void,
    context: any
  ) {
    let htmlString = `<button type="button" class="btn btn-primary btn-lg">${buttonText}</button>`;

    return BootstrapFactory.createDOMElement(
      scene,
      callbackFn,
      context,
      htmlString
    );
  }
}
