import { BaseComponent } from "./BaseComponent";
import { render } from "../utils/render";
import { PlayerSetup } from "./PlayerSetup";
export class MainScreen extends BaseComponent {
  protected createElement(): HTMLElement {
    const container = document.createElement("section");
    container.className = "welcome";
    container.innerHTML = `
      <h1 class="welcome__title">Bienvenido a Juego de Carreras</h1>
      <button id="enter-game" class="welcome__cta">Ingresa al Juego</button>
    `;
    return container;
  }

  public override render(): HTMLElement {
    this.setEvent("click", "#enter-game", () => {
      render(new PlayerSetup(), document.getElementById("app")!);
    });
    return this.element;
  }
}
