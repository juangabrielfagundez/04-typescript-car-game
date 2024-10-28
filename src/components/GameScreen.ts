import { render } from "../utils/render";
import { appState } from "../state/State";
import { BaseComponent } from "./BaseComponent";
import { PodiumScreen } from "./PodiumScreen";

export class GameScreen extends BaseComponent {
  private intervalId?: number;
  private trackHeight = 900;

  protected createElement(): HTMLElement {
    const container = document.createElement("div");
    container.className = "game-screen";
    container.innerHTML = `
      <div id="countdown" class="game-screen__countdown"></div>
      <div id="track" class="track"></div>
    `;
    return container;
  }

  public override render(): HTMLElement {
    appState.subscribe(() => this.updateGameScreen());
    this.startCountdown();
    this.updateGameScreen();
    return this.element;
  }

  private startCountdown() {
    let timeLeft = appState.getState().countdownTime;
    const countdownElement = this.element.querySelector("#countdown")!;
    this.intervalId = window.setInterval(() => {
      countdownElement.textContent = `La carrera inicia en: ${timeLeft}`;
      timeLeft--;
      if (timeLeft < 0) {
        clearInterval(this.intervalId);
        countdownElement.textContent = "¡Comienza la carrera!";
        this.enableRaceControls();
      }
    }, 1000);
  }

  private updateGameScreen() {
    const { players, podium } = appState.getState();
    const trackElement = this.element.querySelector("#track")!;
    trackElement.innerHTML = players
      .map(
        (player, index) => `
        <div class="track__lane">
          <div class="track__player-car" id="player-${
            player.id
          }" style="left: ${index * 100}px; bottom: ${player.position}px;">
            <img src="${player.carImage}" alt="${player.nickname}"/>
            <p>(Tecla: ${player.assignedKey})</p>
          </div>
        </div>
      `
      )
      .join("");

    players.forEach((player) => {
      if (player.position >= this.trackHeight - 230) {
        appState.addToPodium(player);
      }
    });

    if (podium.length === 3 || podium.length === players.length) {
      this.endRace();
    }
  }

  private enableRaceControls() {
    window.addEventListener("keydown", this.handleKeyPress);
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    if (event.repeat) return;
    const key = event.key.toUpperCase();
    const player = appState
      .getState()
      .players.find((p) => p.assignedKey === key);
    if (player) {
      appState.updatePlayerPosition(player.id, 10);
    }
  };

  private endRace() {
    window.removeEventListener("keydown", this.handleKeyPress);
    render(new PodiumScreen(), document.getElementById("app")!);
  }
}
