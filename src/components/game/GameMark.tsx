import type { Player } from "@/lib/game";

type GameMarkProps = {
  player: Player;
  size?: "board" | "status";
};

export function GameMark({ player, size = "board" }: GameMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`game-mark game-mark--${player.toLowerCase()} game-mark--${size}`}
    >
      {player}
    </span>
  );
}
