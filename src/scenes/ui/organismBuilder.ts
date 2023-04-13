import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { UIComponent } from "./UIComponent";
import { UIScene } from "./mainUI";

export class OrganismBuilder extends Sizer implements UIComponent {

    constructor(scene: UIScene) {
        super(scene);


    }

    reset(): void {}
}
