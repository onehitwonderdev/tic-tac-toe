"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { Board as BoardState, CellIndex, Player } from "@/lib/game";
import { GameMark } from "@/components/game/GameMark";

const CELL_NAMES = [
  "Top left",
  "Top center",
  "Top right",
  "Middle left",
  "Center",
  "Middle right",
  "Bottom left",
  "Bottom center",
  "Bottom right",
] as const;

type GameBoardProps = {
  board: BoardState;
  currentPlayer: Player;
  winningLine: readonly CellIndex[] | null;
  isGameOver: boolean;
  onMove: (index: CellIndex) => void;
};

export function GameBoard({
  board,
  currentPlayer,
  winningLine,
  isGameOver,
  onMove,
}: GameBoardProps) {
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  function handleArrowKey(
    event: KeyboardEvent<HTMLButtonElement>,
    index: CellIndex,
  ) {
    if (event.key === "Enter" || event.key === " " || event.code === "Space") {
      event.preventDefault();
      if (!isGameOver && board[index] === null) {
        onMove(index);
      }
      return;
    }

    const row = Math.floor(index / 3);
    const column = index % 3;
    const nextCellByKey: Record<string, [number, number]> = {
      ArrowUp: [row - 1, column],
      ArrowDown: [row + 1, column],
      ArrowLeft: [row, column - 1],
      ArrowRight: [row, column + 1],
    };
    const nextPosition = nextCellByKey[event.key];

    if (!nextPosition) return;

    event.preventDefault();

    const [nextRow, nextColumn] = nextPosition;

    if (nextRow < 0 || nextRow > 2 || nextColumn < 0 || nextColumn > 2) {
      return;
    }

    const nextIndex = nextRow * 3 + nextColumn;
    setFocusedIndex(nextIndex);
    cellRefs.current[nextIndex]?.focus();
  }

  return (
    <div aria-label="Tic-Tac-Toe board" className="game-board" role="grid">
      {[0, 1, 2].map((row) => (
        <div className="game-board__row" role="row" key={row}>
          {[0, 1, 2].map((column) => {
            const index = (row * 3 + column) as CellIndex;
            const square = board[index];
            const isWinningCell = winningLine?.includes(index) ?? false;

            const cellLabel = square
              ? `${CELL_NAMES[index]}, marked ${square}`
              : isGameOver
                ? `${CELL_NAMES[index]}, empty, game over`
                : `${CELL_NAMES[index]}, empty, place ${currentPlayer}`;

            return (
              <div className="game-board__cell" key={index} role="gridcell">
                <button
                  aria-disabled={isGameOver || square !== null}
                  aria-label={cellLabel}
                  className="game-cell"
                  data-symbol={square ?? "empty"}
                  data-winning={isWinningCell}
                  onClick={() => onMove(index)}
                  onFocus={() => setFocusedIndex(index)}
                  onKeyDown={(event) => handleArrowKey(event, index)}
                  ref={(element) => {
                    cellRefs.current[index] = element;
                  }}
                  tabIndex={focusedIndex === index ? 0 : -1}
                  type="button"
                >
                  {square ? <GameMark player={square} /> : null}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
