import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const WIDTH = 76;
const HEIGHT = 33;

export type possibleNumNeighbors = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface IConfig {
  width: number;
  height: number;
  birth: Array<possibleNumNeighbors>;
  survive: Array<possibleNumNeighbors>;
}

export interface BoardState {
  board: number[];
  tempBoard: number[];
  config: IConfig;
  generation: number;
}

const initialState: BoardState = {
  board: new Array<number>(WIDTH * HEIGHT).fill(0),
  tempBoard: new Array<number>(WIDTH * HEIGHT).fill(0),
  config: {
    width: WIDTH,
    height: HEIGHT,
    birth: [3] as possibleNumNeighbors[],
    survive: [2, 3] as possibleNumNeighbors[],
  },
  generation: 0,
};

const getTopIndex = (i: number, width: number, len: number) => {
  return i - width >= 0 ? i - width : len - width + i;
}

const getBottomIndex = (i: number, width: number, len: number) => {
  return len - i > width ? i + width : i % width;
}

const getLeftIndex = (i: number, width: number) => {
  return i % width - 1 >= 0 ? i - 1 : i + width - 1;
}

const getRightIndex = (i: number, width: number) => {
  return i % width != width - 1 ? i + 1 : i - width + 1;
}

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setStateOfCell: (state, action: PayloadAction<number>) => {
      state.board[action.payload] = state.board[action.payload] === 0 ? 1 : 0;
    },
    step: (state) => {
      for (let i = 0; i < state.board.length; i++) {
        const isAlive = state.board[i] === 1 ? true : false;

        const numNeighbors =
          state.board[getTopIndex(i, state.config.width, state.board.length)] +
          state.board[getBottomIndex(i, state.config.width, state.board.length)] +
          state.board[getLeftIndex(i, state.config.width)] +
          state.board[getRightIndex(i, state.config.width)] +
          state.board[getLeftIndex(getTopIndex(i, state.config.width, state.board.length), state.config.width)] +
          state.board[getRightIndex(getTopIndex(i, state.config.width, state.board.length), state.config.width)] + 
          state.board[getLeftIndex(getBottomIndex(i, state.config.width, state.board.length), state.config.width)] + 
          state.board[getRightIndex(getBottomIndex(i, state.config.width, state.board.length), state.config.width)];

        let survive = isAlive;
        if (isAlive) {
          for (let i = 0; i < state.config.survive.length; i++) {
            if (i === 0) {
              survive = numNeighbors === state.config.survive[i];
            } else {
              survive = survive || numNeighbors === state.config.survive[i];
            }
          }
          survive = survive && isAlive;
        }

        let birth = !isAlive;
        if (!isAlive) {
          for (let i = 0; i < state.config.birth.length; i++) {
            if (i === 0) {
              birth = numNeighbors === state.config.birth[i];
            } else {
              birth = birth || numNeighbors === state.config.birth[i];
            }
          }
          birth = birth && !isAlive;
        }

        state.tempBoard[i] = survive || birth ? 1 : 0;
      }
      [state.board, state.tempBoard] = [state.tempBoard, state.board];
      state.generation++;
    },
    setRandomStates: (state) => {
      for (let i = 0; i < state.config.height; i++) {
        for (let j = 0; j < state.config.width; j++) {
          state.board[i * state.config.width + j] = Math.random() > 0.5 ? 1 : 0;
        }
      }
    },
    clear: (state) => {
      for (let i = 0; i < state.config.height; i++) {
        for (let j = 0; j < state.config.width; j++) {
          state.board[i * state.config.width + j] = 0;
        }
      }
      state.generation = 0;
    },
    setBirth: (state, action: PayloadAction<Array<possibleNumNeighbors>>) => {
      state.config.birth = action.payload;
    },
    setSurvive: (state, action: PayloadAction<Array<possibleNumNeighbors>>) => {
      state.config.survive = action.payload;
    },
  },
});

export const { setStateOfCell, step, setRandomStates, clear, setBirth, setSurvive } =
  boardSlice.actions;

export const selectBoard = (state: RootState) => state.board;

export default boardSlice.reducer;
