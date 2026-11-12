export type Player = "X" | "O";
export type Square = Player | null;
export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Board = readonly [
  Square,
  Square,
  Square,
  Square,
  Square,
  Square,
  Square,
  Square,
  Square,
];

export const WINNING_LINES: readonly (readonly CellIndex[])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export type GameState = {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  winningLine: readonly CellIndex[] | null;
  outcome: "playing" | "won" | "draw";
  moveCount: number;
};

export type GameAction =
  | { type: "move"; index: number }
  | { type: "restart" };

export function createInitialGameState(): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
    winner: null,
    winningLine: null,
    outcome: "playing",
    moveCount: 0,
  };
}

export function findWinningLine(
  board: Board,
): { player: Player; line: readonly CellIndex[] } | null {
  for (const line of WINNING_LINES) {
    const [first, second, third] = line;
    const player = board[first];

    if (player && player === board[second] && player === board[third]) {
      return { player, line };
    }
  }

  return null;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "restart") {
    return createInitialGameState();
  }

  const { index } = action;

  if (
    state.outcome !== "playing" ||
    !Number.isInteger(index) ||
    index < 0 ||
    index > 8 ||
    state.board[index] !== null
  ) {
    return state;
  }

  const board = [...state.board] as [
    Square,
    Square,
    Square,
    Square,
    Square,
    Square,
    Square,
    Square,
    Square,
  ];
  board[index] = state.currentPlayer;

  const nextMoveCount = state.moveCount + 1;
  const winningResult = findWinningLine(board);

  if (winningResult) {
    return {
      board,
      currentPlayer: state.currentPlayer,
      winner: winningResult.player,
      winningLine: winningResult.line,
      outcome: "won",
      moveCount: nextMoveCount,
    };
  }

  if (nextMoveCount === 9) {
    return {
      board,
      currentPlayer: state.currentPlayer,
      winner: null,
      winningLine: null,
      outcome: "draw",
      moveCount: nextMoveCount,
    };
  }

  return {
    board,
    currentPlayer: state.currentPlayer === "X" ? "O" : "X",
    winner: null,
    winningLine: null,
    outcome: "playing",
    moveCount: nextMoveCount,
  };
}

export function getStatusMessage(state: GameState): string {
  if (state.outcome === "won" && state.winner) {
    return `Player ${state.winner} wins.`;
  }

  if (state.outcome === "draw") {
    return "It's a draw.";
  }

  return state.moveCount === 0
    ? "X starts. Choose a square."
    : `Player ${state.currentPlayer}'s turn.`;
}
