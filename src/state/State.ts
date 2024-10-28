
import { v4 as uuidv4 } from "uuid";
import { GameState, Player } from "../models";

type Listener = (state: GameState) => void;

class State {
  private state: GameState;
  private listeners: Listener[] = [];

  constructor() {
    this.state = {
      players: [],
      gameStarted: false,
      podium: [],
      countdownTime: 10,
    };
  }

  public subscribe(listener: Listener) {
    this.listeners.push(listener);
  }

  public notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  public getState(): GameState {
    return this.state;
  }

  public addPlayer(nickname: string, carImage: string): boolean {
    if (this.state.players.length >= 5) return false;
    if (this.state.players.some((p) => p.carImage === carImage)) return false;
    const assignedKey = this.assignRandomKey();
    const player: Player = {
      id: uuidv4(),
      nickname,
      carImage,
      assignedKey,
      position: 0,
    };
    this.state.players.push(player);
    this.notify();
    return true;
  }

  private assignRandomKey(): string {
    const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let key: string;
    do {
      key = keys.charAt(Math.floor(Math.random() * keys.length));
    } while (this.state.players.some((p) => p.assignedKey === key));
    return key;
  }

  public startGame() {
    if (this.state.players.length < 2) {
      throw new Error(
        "Se requieren al menos 2 jugadores para iniciar el juego."
      );
    }
    this.state.gameStarted = true;
    this.notify();
  }

  public updatePlayerPosition(playerId: string, distance: number) {
    const player = this.state.players.find((p) => p.id === playerId);
    if (player) {
      player.position += distance;
      this.notify();
    }
  }

  public addToPodium(player: Player) {
    if (!this.state.podium.includes(player)) {
      this.state.podium.push(player);
      this.notify();
    }
  }

  public resetGame() {
    this.state.players = [];
    this.state.gameStarted = false;
    this.state.podium = [];
    this.state.countdownTime = 10;
    this.notify();
  }
}

export const appState = new State();
