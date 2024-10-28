import { Player } from ".";

export interface GameState {
  players: Player[];
  gameStarted: boolean;
  podium: Player[];
  countdownTime: number;
}
