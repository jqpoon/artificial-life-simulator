export interface UIComponent {
  preload(): void;
  create(): void;
  reset(): void;
}
