import { UIComponent } from "./UIComponent";

export abstract class ChartComponent extends UIComponent {
    abstract updateChart_(): void;
}
