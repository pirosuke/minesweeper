<template>
    <g transform="translate(0, 40)">
        <g v-for="item in cellList" v-bind:key="item.cellId">
            <rect width="30" height="30" stroke="black" v-bind:fill="(item.isOpened ? '#fff' : '#ccc')" stroke-width="1" @click="onCellClick(item.cellId, $event)" v-bind:x="item.x" v-bind:y="item.y" />
            <text pointer-events="none" v-bind:x="item.x + 10" v-bind:y="item.y + 20">{{ item.value }}</text>
        </g>
    </g>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { CellItem } from '../store';

interface CellViewItem extends CellItem {
    x: number;
    y: number;
    value: string;
}

@Component
export default class CellList extends Vue {
    get cellList() {
        const cellMap = this.$store.getters.getCellMap();
        const isGameOver = this.$store.getters.isGameOver();
        const cellViewList: CellViewItem[] = [];
        for (const cellId in cellMap) {
            const cellItem = cellMap[cellId];
            cellViewList.push(Object.assign({
                x: cellItem.col * 30,
                y: cellItem.row * 30,
                value: this.getCellValue(cellItem, isGameOver),
            }, cellItem));
        }

        return cellViewList;
    }

    public onCellClick(cellId: number, e: any) {
        this.$store.dispatch('openCell', cellId);
    }

    private getCellValue(cellItem: CellItem, isGameOver: boolean) {
        let value = '';
        if (isGameOver) {
            if (cellItem.hasMine) {
                value = 'x';
            } else {
                value = cellItem.contacts.toString();
            }
        } else {
            if (cellItem.isOpened) {
                value = cellItem.contacts.toString();
            }
        }

        return value;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
