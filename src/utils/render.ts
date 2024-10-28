import { BaseComponent } from "../components/BaseComponent";

export function render(component: BaseComponent, container: HTMLElement) {
  container.innerHTML = "";
  container.appendChild(component.render());
}
