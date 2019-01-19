<template>
    <g transform="translate(1, 90)">
        <g v-for="item in cellList" v-bind:key="item.cellId">
            <rect width="50" height="50" stroke="#ccc" v-bind:fill="(item.isOpened ? (item.hasMine ? '#c51162' : '#fff') : '#6200ee')" stroke-width="1" @click="onCellClick(item.cellId, $event)" v-bind:x="item.x" v-bind:y="item.y" />
            <text pointer-events="none" font-weight="bold" v-bind:x="item.x + 20" v-bind:y="item.y + 30" v-bind:fill="item.color">{{ item.value }}</text>
        </g>
    </g>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  created () {
  },
  computed: {
    ...mapGetters({
    }),
    cellList: function () {
        const cellMap = this.$store.getters.getCellMap();
        const isGameOver = this.$store.getters.isGameOver();
        const cellViewList = [];
        for (const cellId in cellMap) {
            const cellItem = cellMap[cellId];
            cellViewList.push(Object.assign({
                x: cellItem.position.col * 50,
                y: cellItem.position.row * 50,
                value: this.getCellValue(cellItem, isGameOver),
                color: this.getCellColor(cellItem),
            }, cellItem));
        }

        return cellViewList;
    }
  },
  methods: {
    onCellClick(cellId, e) {
        this.$store.dispatch('openCell', cellId);
    },

    getCellColor(cellItem) {
        let value = '';
        if (cellItem.isOpened) {
            if (cellItem.hasMine) {
                value = 'white';
            } else {
                switch (cellItem.contacts) {
                    case 1:
                        value = '#090';
                        break;
                    case 2:
                        value = '#f66';
                        break;
                    case 3:
                        value = '#c33';
                        break;
                    case 4:
                        value = '#600';
                        break;
                    case 5:
                        value = '#300';
                        break;
                    default:
                        value = '#fff';
                }
            }
        }

        return value;
    },

    getCellValue(cellItem, isGameOver) {
        let value = '';
        if (isGameOver) {
            if (cellItem.hasMine) {
                value = 'x';
            } else {
                value = cellItem.contacts;
            }
        } else {
            if (cellItem.isOpened) {
                value = cellItem.contacts;
            }
        }

        return value;
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
