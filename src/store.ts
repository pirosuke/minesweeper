import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface CellItem {
  cellId: number;
  row: number;
  col: number;
  isOpened: boolean;
  contacts: number;
  hasMine: boolean;
}

interface State {
  cells: { [index: number]: CellItem; };
  isGameOver: boolean;
}

function generateMineCellList(maxRowNum: number, maxColNum: number, maxMineNum: number) {
  const mineCellIdList: number[] = [];
  while (mineCellIdList.length < maxMineNum) {
    const cellId: number = Math.floor(Math.random() * Math.floor(maxColNum * maxRowNum)) + 1;
    if (mineCellIdList.indexOf(cellId) === -1) {
      mineCellIdList.push(cellId);
    }
  }

  const mineCellList: boolean[][] = [];
  let mineCellId = 1;
  for (let row = 0; row < maxRowNum; row++) {
    const colList: boolean[] = [];
    for (let col = 0; col < maxColNum; col++) {

      colList.push(mineCellIdList.indexOf(mineCellId) !== -1);
      mineCellId++;
    }
    mineCellList.push(colList);
  }

  return mineCellList;
}

function calcMineContactNum(row: number, col: number, mineCellList: boolean[][]): number {
  let contactNum = 0;

  if (row > 0) {
    if (col > 0 && mineCellList[row - 1][col - 1]) {
      contactNum++;
    }
    if (mineCellList[row - 1][col]) {
      contactNum++;
    }
    if (col < mineCellList[row - 1].length - 1 && mineCellList[row - 1][col + 1]) {
      contactNum++;
    }
  }

  if (col > 0 && mineCellList[row][col - 1]) {
    contactNum++;
  }
  if (col < mineCellList[row].length && mineCellList[row][col + 1]) {
    contactNum++;
  }

  if (row < mineCellList.length - 1) {
    if (col > 0 && mineCellList[row + 1][col - 1]) {
      contactNum++;
    }
    if (mineCellList[row + 1][col]) {
      contactNum++;
    }
    if (col < mineCellList[row + 1].length - 1 && mineCellList[row + 1][col + 1]) {
      contactNum++;
    }
  }
  return contactNum;
}

export default new Vuex.Store({
  state: {
    cells: {},
    isGameOver: false,
  } as State,
  getters: {
    getCellMap: (state, getters) => () => {
      return state.cells;
    },
    isGameOver: (state, getters) => () => {
      return state.isGameOver;
    },
  },
  mutations: {
    generateCells(state, payload) {
      const maxRowNum = 9;
      const maxColNum = 9;
      const maxMineNum = 10;
      const mineCellList = generateMineCellList(maxRowNum, maxColNum, maxMineNum);

      const cellMap: { [index: number]: CellItem; } = {};
      let newCellId = 1;
      for (let row = 0; row < maxRowNum; row++) {
        for (let col = 0; col < maxColNum; col++) {
          const cellItem: CellItem = {
            cellId: newCellId,
            row,
            col,
            isOpened: false,
            contacts: calcMineContactNum(row, col, mineCellList),
            hasMine: mineCellList[row][col],
          };

          cellMap[newCellId] = cellItem;
          newCellId++;
        }
      }

      state.cells = cellMap;
    },
    setGameOver(state, payload) {
      state.isGameOver = payload.isGameOver;
    },
    openCell(state, payload) {
      state.cells[payload.cellId].isOpened = true;
    },
    openAll(state, payload) {
      for (const cellId in state.cells) {
        const cellItem = state.cells[cellId];
        cellItem.isOpened = true;
      }
    },
  },
  actions: {
    resetGame(context) {
      context.commit('setGameOver', {
        isGameOver: false,
      });
      context.commit('generateCells');
    },
    gameOver(context) {
      context.commit('openAll');
      context.commit('setGameOver', {
        isGameOver: true,
      });
    },
    openCell(context, cellId: number) {
      if (context.state.cells[cellId].hasMine) {
        context.dispatch('gameOver');
      } else {
        context.commit('openCell', {
          cellId,
        });
      }
    },
  },
});
