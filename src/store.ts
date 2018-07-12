import Vue from 'vue';
import Vuex from 'vuex';

import _ from 'lodash';

Vue.use(Vuex);

export interface Position {
  row: number;
  col: number;
}

export interface CellItem {
  cellId: number;
  position: Position;
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

function getSurroundingCellPositions(position: Position): Position[] {
  return [
    {row: position.row - 1, col: position.col - 1},
    {row: position.row - 1, col: position.col},
    {row: position.row - 1, col: position.col + 1},
    {row: position.row, col: position.col - 1},
    {row: position.row, col: position.col + 1},
    {row: position.row + 1, col: position.col - 1},
    {row: position.row + 1, col: position.col},
    {row: position.row + 1, col: position.col + 1},
  ];
}

function getSurroundingCells(
  targetCell: CellItem, cellList: CellItem[]): CellItem[] {
  const surroundingCellPositionList: Position[] = getSurroundingCellPositions(targetCell.position);

  const surroundingCellList: CellItem[] = [];
  for (const cellItem of cellList) {
    if (surroundingCellPositionList.some((position: Position) => {
      return _.isEqual(position, cellItem.position);
    })) {
      surroundingCellList.push(cellItem);
    }
  }

  return surroundingCellList;
}

function calcMineContactNum(position: Position, mineCellList: boolean[][]): number {
  let contactNum = 0;
  if (position.row > 0) {
    if (position.col > 0 && mineCellList[position.row - 1][position.col - 1]) {
      contactNum++;
    }
    if (mineCellList[position.row - 1][position.col]) {
      contactNum++;
    }
    if (position.col < mineCellList[position.row - 1].length - 1 && mineCellList[position.row - 1][position.col + 1]) {
      contactNum++;
    }
  }

  if (position.col > 0 && mineCellList[position.row][position.col - 1]) {
    contactNum++;
  }
  if (position.col < mineCellList[position.row].length && mineCellList[position.row][position.col + 1]) {
    contactNum++;
  }

  if (position.row < mineCellList.length - 1) {
    if (position.col > 0 && mineCellList[position.row + 1][position.col - 1]) {
      contactNum++;
    }
    if (mineCellList[position.row + 1][position.col]) {
      contactNum++;
    }
    if (position.col < mineCellList[position.row + 1].length - 1 && mineCellList[position.row + 1][position.col + 1]) {
      contactNum++;
    }
  }
  return contactNum;
}

function getCellIdsForBulkOpen(targetCell: CellItem, cells: {[index: number]: CellItem}): number[] {
  if (targetCell.contacts > 0) {
    return [];
  }

  let openingCellIdList: number[] = [];
  const surroundingCells: CellItem[] = getSurroundingCells(targetCell, _.values(cells));
  openingCellIdList = _.union(openingCellIdList, surroundingCells.map((ci: CellItem) => ci.cellId));

  const zeroContactCells = surroundingCells.filter((ci: CellItem) => ci.contacts === 0);
  for (const zeroContactCellItem of zeroContactCells) {
    openingCellIdList = _.union(openingCellIdList,
      getCellIdsForBulkOpen(zeroContactCellItem, _.omit(cells, openingCellIdList, targetCell.cellId)));
  }

  return openingCellIdList;
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
            position: {row, col},
            isOpened: false,
            contacts: calcMineContactNum({row, col}, mineCellList),
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

        const bulkOpenCellIdList = getCellIdsForBulkOpen(context.state.cells[cellId], context.state.cells);
        for (const bulkOpenCellId of bulkOpenCellIdList) {
          context.commit('openCell', {
            cellId: bulkOpenCellId,
          });
        }
      }
    },
  },
});
