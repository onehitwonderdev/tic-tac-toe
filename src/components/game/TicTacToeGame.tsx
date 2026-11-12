"use client";

import { useReducer } from "react";
import { Minus, RotateCcw } from "lucide-react";
import { GameBoard } from "@/components/game/GameBoard";
import { GameMark } from "@/components/game/GameMark";
import {
  createInitialGameState,
  gameReducer,
  getStatusMessage,
} from "@/lib/game";

export function TicTacToeGame() {
  const [game, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialGameState,
  );
  const statusMessage = getStatusMessage(game);
  const isGameOver = game.outcome !== "playing";

  return (
    <main className="min-h-screen px-5 pb-8 pt-6 sm:px-8 sm:pt-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col">
        <header className="site-header flex items-center justify-between pb-5">
          <div className="inline-flex items-center gap-3">
            <span aria-hidden="true" className="brand-mark">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span className="text-sm font-semibold tracking-tight text-stone-100">
              Tic-Tac-Toe
            </span>
          </div>
          <p className="text-sm font-medium text-stone-400">
            Local play for two
          </p>
        </header>

        <div
          className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-12"
          id="game"
        >
          <section aria-labelledby="game-title" className="lg:pb-4">
            <p className="mb-5 text-sm font-medium text-lime-300">
              Pass the screen
            </p>
            <h1
              className="max-w-lg text-[clamp(1.75rem,3.5vw,2rem)] font-semibold leading-tight tracking-[-0.04em] text-stone-50"
              id="game-title"
            >
              Tic-Tac-Toe
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-stone-400 sm:text-lg sm:leading-8">
              Take turns placing X and O. Make three in a row to win.
            </p>

            <p className="mt-10 max-w-sm text-sm leading-6 text-stone-400 sm:mt-14">
              Use the arrow keys to move around the board. Press Enter or Space
              to place your mark.
            </p>
          </section>

          <section aria-label="Game board and controls" className="mx-auto w-full max-w-[35rem]">
            <div className="game-toolbar mb-4 flex items-center justify-between gap-4 pb-4">
              <div className="flex min-w-0 items-center gap-3">
                <div aria-hidden="true" className="turn-mark">
                  {game.outcome === "draw" ? (
                    <Minus className="text-stone-400" size={24} strokeWidth={1.8} />
                  ) : (
                    <GameMark
                      player={game.winner ?? game.currentPlayer}
                      size="status"
                    />
                  )}
                </div>
                <p
                  aria-atomic="true"
                  aria-live="polite"
                  className="text-sm font-medium text-stone-200"
                  id="game-status"
                  role="status"
                >
                  {statusMessage}
                </p>
              </div>
              <p
                aria-label={`${game.moveCount} of 9 moves played`}
                className="shrink-0 text-sm tabular-nums text-stone-400"
              >
                {game.moveCount} / 9
              </p>
            </div>

            <GameBoard
              board={game.board}
              currentPlayer={game.currentPlayer}
              isGameOver={isGameOver}
              onMove={(index) => dispatch({ type: "move", index })}
              winningLine={game.winningLine}
            />

            <div className="mt-5 flex justify-end">
              <button
                className="restart-button"
                onClick={() => dispatch({ type: "restart" })}
                type="button"
              >
                <RotateCcw aria-hidden="true" size={16} strokeWidth={1.8} />
                {isGameOver ? "Play again" : "Restart"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
