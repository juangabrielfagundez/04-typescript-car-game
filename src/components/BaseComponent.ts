export abstract class BaseComponent {
  protected element: HTMLElement;
  constructor(protected props?: any) {
    this.element = this.createElement();
  }

  protected abstract createElement(): HTMLElement;

  public render(): HTMLElement {
    return this.element;
  }

  protected setEvent<K extends keyof HTMLElementEventMap>(
    type: K,
    selector: string,
    handler: (event: HTMLElementEventMap[K]) => void
  ) {
    const element = this.element.querySelector(selector) as HTMLElement | null;
    if (element) {
      element.addEventListener(type, handler);
    }
  }
}
