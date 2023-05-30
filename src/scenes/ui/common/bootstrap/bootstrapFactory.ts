type DropdownOption = { [key: string]: string }; // key: 'display text'

let quickUUID = () => {
  return Math.random().toString(36).substring(2, 15);
};

export class BootstrapFactory {
  private static createDOMElement(
    scene: Phaser.Scene,
    callbackFn: (e: any) => void,
    context: any,
    htmlString: string,
    x: number = 0,
    y: number = 0
  ) {
    /* Add functionality */
    let element = scene.add.dom(x, y).createFromHTML(htmlString);
    element.addListener('click');
    element.on('click', callbackFn, context);

    return element;
  }

  /**
   * Creates a new dropdown menu using bootstrap
   *
   * @param scene
   * @param x Optional, x position on the screen
   * @param y Optional, y position on the screen
   */
  public static createDropdown(
    scene: Phaser.Scene,
    callbackFn: (e: any) => void,
    context: any,
    options: DropdownOption,
    x: number = 0,
    y: number = 0
  ) {
    /* Craft bootstrap html */
    let htmlString = `<select class="form-select form-select-lg mb-3">
    `;

    for (const [key, displayText] of Object.entries(options)) {
      htmlString += `<option value="${key}">${displayText}</option>`;
    }

    htmlString += `</select>`;

    return BootstrapFactory.createDOMElement(
      scene,
      callbackFn,
      context,
      htmlString,
      x,
      y
    );
  }

  /**
   * Creates a new slider using bootstrap
   *
   * @param scene
   * @param callbackFn - Function to call when
   * @param context
   * @param min
   * @param max
   * @param x
   * @param y
   * @returns
   */
  public static createSlider(
    scene: Phaser.Scene,
    callbackFn: (e: any) => void,
    context: any,
    min: number = 0,
    max: number = 100,
    x: number = 0,
    y: number = 0
  ) {
    let htmlString = `<input type="range" style="margin: auto; display: block;" class="form-range w-50" min="${min}" max="${max}">`;

    return BootstrapFactory.createDOMElement(
      scene,
      callbackFn,
      context,
      htmlString,
      x,
      y
    );
  }

  public static createHelpIcon(
    scene: Phaser.Scene,
    helpText: string,
    x: number = 0,
    y: number = 0
  ) {
    let id = quickUUID();
    let htmlString = `<button type="button" class="btn btn-primary" data-bs-trigger="hover" data-bs-toggle="tooltip" data-bs-placement="top" title="${helpText}" id="${id}">
      <i class="bi bi-question-circle"></i>
      </button>
      <script>
        var exampleEl = document.getElementById('${id}')
        var tooltip = new bootstrap.Tooltip(exampleEl)
      </script>
      `;

    return BootstrapFactory.createDOMElement(
      scene,
      () => {},
      null,
      htmlString,
      x,
      y
    );
  }
}
