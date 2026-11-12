import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createInitialGameState,
  findWinningLine,
  gameReducer,
  getStatusMessage,
  WINNING_LINES,
} from "../src/lib/game.ts";

function boardWithLine(line, player) {
  const board = Array(9).fill(null);
  for (const index of line) board[index] = player;
  return board;
}

function playMoves(moves) {
  return moves.reduce(
    (state, index) => gameReducer(state, { type: "move", index }),
    createInitialGameState(),
  );
}

test("defines all three horizontal, three vertical, and two diagonal lines", () => {
  assert.equal(WINNING_LINES.length, 8);
  assert.deepEqual(WINNING_LINES, [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]);
});

test("detects X and O wins for every winning line", () => {
  for (const line of WINNING_LINES) {
    for (const player of ["X", "O"]) {
      const result = findWinningLine(boardWithLine(line, player));
      assert.equal(result?.player, player);
      assert.deepEqual(result?.line, line);
    }
  }
});

test("does not report a win for an incomplete or empty line", () => {
  assert.equal(findWinningLine(Array(9).fill(null)), null);
  assert.equal(findWinningLine(boardWithLine([0, 1], "X")), null);
});

test("starts with X and alternates turns after each valid move", () => {
  const initial = createInitialGameState();
  assert.equal(initial.currentPlayer, "X");

  const afterX = gameReducer(initial, { type: "move", index: 4 });
  assert.equal(afterX.board[4], "X");
  assert.equal(afterX.currentPlayer, "O");
  assert.equal(afterX.moveCount, 1);

  const afterO = gameReducer(afterX, { type: "move", index: 0 });
  assert.equal(afterO.board[0], "O");
  assert.equal(afterO.currentPlayer, "X");
  assert.equal(afterO.moveCount, 2);
  assert.equal(initial.board[4], null);
});

test("rejects occupied and out-of-range moves without changing state", () => {
  const state = gameReducer(createInitialGameState(), { type: "move", index: 0 });

  for (const index of [0, -1, 9, 1.5]) {
    assert.equal(gameReducer(state, { type: "move", index }), state);
  }
});

test("records the winner and winning cells, then blocks further moves", () => {
  const state = playMoves([0, 3, 1, 4, 2]);

  assert.equal(state.outcome, "won");
  assert.equal(state.winner, "X");
  assert.deepEqual(state.winningLine, [0, 1, 2]);
  assert.equal(state.moveCount, 5);
  assert.equal(gameReducer(state, { type: "move", index: 8 }), state);
});

test("completes vertical and both diagonal wins during alternating play", () => {
  const winningGames = [
    [0, 1, 3, 2, 6], // vertical
    [0, 1, 4, 2, 8], // top-left to bottom-right
    [2, 1, 4, 3, 6], // top-right to bottom-left
  ];

  for (const moves of winningGames) {
    const state = playMoves(moves);
    assert.equal(state.outcome, "won");
    assert.equal(state.winner, "X");
    assert.ok(state.winningLine);
  }
});

test("allows O to win after alternating turns", () => {
  const state = playMoves([0, 3, 1, 4, 8, 5]);

  assert.equal(state.outcome, "won");
  assert.equal(state.winner, "O");
  assert.deepEqual(state.winningLine, [3, 4, 5]);
});

test("detects a draw after all nine squares fill without a winner", () => {
  const state = playMoves([0, 1, 2, 4, 3, 5, 7, 6, 8]);

  assert.equal(state.outcome, "draw");
  assert.equal(state.winner, null);
  assert.equal(state.moveCount, 9);
  assert.ok(state.board.every((square) => square !== null));
  assert.equal(gameReducer(state, { type: "move", index: 0 }), state);
});

test("restart clears the board and restores X as the first player", () => {
  const finishedGame = playMoves([0, 3, 1, 4, 2]);
  const restarted = gameReducer(finishedGame, { type: "restart" });

  assert.deepEqual(restarted, createInitialGameState());
  assert.notEqual(restarted, finishedGame);

  const restartedMidgame = gameReducer(playMoves([0, 1]), { type: "restart" });
  assert.deepEqual(restartedMidgame, createInitialGameState());
});

test("provides readable status for a turn, a win, and a draw", () => {
  assert.equal(getStatusMessage(createInitialGameState()), "X starts. Choose a square.");
  assert.equal(getStatusMessage(playMoves([0])), "Player O's turn.");
  assert.equal(getStatusMessage(playMoves([0, 3, 1, 4, 2])), "Player X wins.");
  assert.equal(
    getStatusMessage(playMoves([0, 1, 2, 4, 3, 5, 7, 6, 8])),
    "It's a draw.",
  );
});
