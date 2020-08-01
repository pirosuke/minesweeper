import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash';

Vue.use(Vuex)

function generateMineCellList(maxRowNum, maxColNum, maxMineNum) {
  const mineCellIdList = [];
  while (mineCellIdList.length < maxMineNum) {
    const cellId = Math.floor(Math.random() * Math.floor(maxColNum * maxRowNum)) + 1;
    if (mineCellIdList.indexOf(cellId) === -1) {
      mineCellIdList.push(cellId);
    }
  }
  const mineCellList = [];
  let mineCellId = 1;
  for (let row = 0; row < maxRowNum; row++) {
    const colList = [];
    for (let col = 0; col < maxColNum; col++) {
      colList.push(mineCellIdList.indexOf(mineCellId) !== -1);
      mineCellId++;
    }
    mineCellList.push(colList);
  }
  return mineCellList;
}

function getSurroundingCellPositions(position) {
  return [
    { row: position.row - 1, col: position.col - 1 },
    { row: position.row - 1, col: position.col },
    { row: position.row - 1, col: position.col + 1 },
    { row: position.row, col: position.col - 1 },
    { row: position.row, col: position.col + 1 },
    { row: position.row + 1, col: position.col - 1 },
    { row: position.row + 1, col: position.col },
    { row: position.row + 1, col: position.col + 1 },
  ];
}

function getSurroundingCells(targetCell, cellList) {
  const surroundingCellPositionList = getSurroundingCellPositions(targetCell.position);
  const surroundingCellList = [];
  for (const cellItem of cellList) {
    if (surroundingCellPositionList.some((position) => {
      return _.isEqual(position, cellItem.position);
    })) {
      surroundingCellList.push(cellItem);
    }
  }
  return surroundingCellList;
}

function calcMineContactNum(position, mineCellList) {
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

function getCellIdsForBulkOpen(targetCell, cells) {
  if (targetCell.contacts > 0) {
    return [];
  }
  let openingCellIdList = [];
  const surroundingCells = getSurroundingCells(targetCell, _.values(cells));
  openingCellIdList = _.union(openingCellIdList, surroundingCells.map((ci) => ci.cellId));
  const zeroContactCells = surroundingCells.filter((ci) => ci.contacts === 0);
  for (const zeroContactCellItem of zeroContactCells) {
    openingCellIdList = _.union(openingCellIdList, getCellIdsForBulkOpen(zeroContactCellItem, _.omit(cells, openingCellIdList, targetCell.cellId)));
  }
  return openingCellIdList;
}

export default new Vuex.Store({
  state: {
    cells: {},
    isGameOver: false,
    hasWon: false,
    maxRowNum: 9,
    maxColNum: 9,
    maxMineNum: 10,
  },
  getters: {
    getCellMap: (state) => () => {
      return state.cells;
    },
    isGameOver: (state) => () => {
      return state.isGameOver;
    },
    hasWon: (state) => () => {
      return state.hasWon;
    },
    getMaxMineNum: (state) => () => {
      return state.maxMineNum;
    },
    getRemainingOpenableCellNum: (state) => () => {
      return _.values(state.cells).filter((ci) => !ci.isOpened).length - state.maxMineNum;
    },
  },
  mutations: {
    generateCells(state) {
      const mineCellList = generateMineCellList(state.maxRowNum, state.maxColNum, state.maxMineNum);
      const cellMap = {};
      let newCellId = 1;
      for (let row = 0; row < state.maxRowNum; row++) {
        for (let col = 0; col < state.maxColNum; col++) {
          const cellItem = {
            cellId: newCellId,
            position: { row, col },
            isOpened: false,
            contacts: calcMineContactNum({ row, col }, mineCellList),
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
    setHasWon(state, payload) {
      state.hasWon = payload.hasWon;
    },
    openCell(state, payload) {
      state.cells[payload.cellId].isOpened = true;
    },
    openAll(state) {
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
      context.commit('setHasWon', {
        hasWon: false,
      });
      context.commit('generateCells');
    },
    gameOver(context) {
      context.commit('openAll');
      context.commit('setGameOver', {
        isGameOver: true,
      });
    },
    openCell(context, cellId) {
      if (context.state.cells[cellId].hasMine) {
        context.dispatch('gameOver');
      }
      else {
        context.commit('openCell', {
          cellId,
        });
        const bulkOpenCellIdList = getCellIdsForBulkOpen(context.state.cells[cellId], context.state.cells);
        for (const bulkOpenCellId of bulkOpenCellIdList) {
          context.commit('openCell', {
            cellId: bulkOpenCellId,
          });
        }
        const closedCellCount = _.sumBy(_.values(context.state.cells), (cellItem) => cellItem.isOpened ? 0 : 1);
        if (context.state.maxMineNum === closedCellCount) {
          context.commit('setHasWon', {
            hasWon: true,
          });
          context.dispatch('gameOver');
        }
      }
    },
  },
  modules: {
  }
})
