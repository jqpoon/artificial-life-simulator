import { UIComponent } from "../UIComponent";

export abstract class TabComponent extends UIComponent {
  public setHidden(): void {
    this.setVisible(true);
  }
}
