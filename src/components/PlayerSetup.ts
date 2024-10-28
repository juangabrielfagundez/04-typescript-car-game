import { render } from "../utils/render";
import { appState } from "../state/State";
import { BaseComponent } from "./BaseComponent";
import { GameScreen } from "./GameScreen";

export class PlayerSetup extends BaseComponent {
  protected createElement(): HTMLElement {
    const container = document.createElement("section");
    container.id = "player";
    container.classList.add("player");
    container.innerHTML = `
      <input type="text" id="nickname" class="player__nickname" placeholder="Nickname" />
      <div class="carousel">
        <button id="prev-car" class="carousel__button">⬅️</button>
        <img id="car-image" class="carousel__image" src="/src/assets/images/car-blue-f1.webp" alt="Car Image">
        <button id="next-car" class="carousel__button">➡️</button>
      </div>
      <button id="add-player" class="player__button">Agregar Jugador</button>
      <button id="start-game" class="player__button">Iniciar Juego</button>
      <div id="waiting-players"></div>
`;
    return container;
  }

  private carImages = [
    "car-blue-f1.webp",
    "car-red-f1.webp",
    "car-blue.webp",
    "car-green.webp",
    "car-orange.webp",
    "car-white.webp",
    "car-pink.webp",
  ];

  private currentCarIndex = 0;

  private handleAddPlayer() {
    const nicknameInput = this.element.querySelector(
      "#nickname"
    ) as HTMLInputElement;
    const nickname = nicknameInput.value.trim();
    const carImage = `/src/assets/images/${
      this.carImages[this.currentCarIndex]
    }`;

    if (nickname) {
      const success = appState.addPlayer(nickname, carImage);
      if (!success) {
        alert(
          "No se pudo agregar al jugador. Verifica que el carro no haya sido seleccionado o el límite de jugadores."
        );
      } else {
        nicknameInput.value = "";
      }
    } else {
      alert("Por favor, ingresa un nickname.");
    }
  }

  private updateCarImage() {
    const carImage = this.element.querySelector(
      "#car-image"
    ) as HTMLImageElement;
    carImage.src = `/src/assets/images/${this.carImages[this.currentCarIndex]}`;
  }

  private handleNextCar() {
    this.currentCarIndex = (this.currentCarIndex + 1) % this.carImages.length;
    this.updateCarImage();
  }

  private handlePrevCar() {
    this.currentCarIndex =
      (this.currentCarIndex - 1 + this.carImages.length) %
      this.carImages.length;
    this.updateCarImage();
  }

  private handleStartGame() {
    try {
      appState.startGame();
      render(new GameScreen(), document.getElementById("app")!);
    } catch (error) {
      if (!(error instanceof Error)) throw new Error("Errror desconocido");
      alert(error.message);
    }
  }

  private updateWaitingPlayers() {
    const waitingPlayersDiv = this.element.querySelector("#waiting-players")!;
    const players = appState.getState().players;
    waitingPlayersDiv.innerHTML = players
      .map((p) => `<p>${p.nickname} ha ingresado al juego.</p>`)
      .join("");
  }

  public override render(): HTMLElement {
    appState.subscribe(() => this.updateWaitingPlayers());
    this.setEvent("click", "#next-car", () => this.handleNextCar());
    this.setEvent("click", "#prev-car", () => this.handlePrevCar());
    this.setEvent("click", "#add-player", () => this.handleAddPlayer());
    this.setEvent("click", "#start-game", () => this.handleStartGame());
    return this.element;
  }
}
