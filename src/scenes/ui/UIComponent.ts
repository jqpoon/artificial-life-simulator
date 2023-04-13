import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";

export abstract class UIComponent extends Sizer {
  abstract reset(): void;
}
