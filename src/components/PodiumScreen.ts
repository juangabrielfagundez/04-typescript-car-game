import { render } from "../utils/render";
import { appState } from "../state/State";
import { BaseComponent } from "./BaseComponent";
import { MainScreen } from "./MainScreen";

export class PodiumScreen extends BaseComponent {
  protected createElement(): HTMLElement {
    const container = document.createElement("div");
    container.className = "podium";
    container.innerHTML = `
      <h2>Resultados de la Carrera</h2>
      <ol id="podium-list" class="podium__list"></ol>
      <button id="restart-game">Reiniciar Juego</button>
    `;
    return container;
  }

  public override render(): HTMLElement {
    this.setEvent("click", "#restart-game", () => this.handleRestartGame());
    this.updatePodium();
    return this.element;
  }

  private updatePodium() {
    const podiumList = this.element.querySelector("#podium-list")!;
    const podium = appState.getState().podium;
    podiumList.innerHTML = podium
      .map(
        (player, index) => `
      <li>
        <strong>${index + 1}º Lugar:</strong> ${player.nickname}
      </li>
    `
      )
      .join("");
  }

  private handleRestartGame() {
    appState.resetGame();
    render(new MainScreen(), document.getElementById("app")!);
  }
}
