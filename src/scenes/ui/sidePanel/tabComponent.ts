import { UIComponent } from "../common/UIComponent";

export abstract class TabComponent extends UIComponent {
  public setHidden(): void {
    this.setVisible(true);
  }
}
