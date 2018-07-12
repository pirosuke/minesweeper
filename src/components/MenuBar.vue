<template>
    <g>
        <g>
            <rect width="270" height="30" x="0" y="0" stroke="black" fill="#ccc" stroke-width="1" @click="onResetClick" />
            <text pointer-events="none" x="5" y="20">さいしょからやりなおし</text>
        </g>
        <g transform="translate(0, 40)" v-if="isGameOver">
            <g v-if="hasWon">
                <rect width="270" height="30" x="0" y="0" stroke="blue" fill="#fff" stroke-width="1" @click="onResetClick" />
                <text pointer-events="none" x="5" y="20" stroke="none" fill="blue">あなたのかち！</text>
            </g>
            <g v-else>
                <rect width="270" height="30" x="0" y="0" stroke="red" fill="#fff" stroke-width="1" @click="onResetClick" />
                <text pointer-events="none" x="5" y="20" stroke="none" fill="red">あなたのまけ！</text>
            </g>
        </g>
    </g>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MenuBar extends Vue {
    public onResetClick(e: any) {
        this.$store.dispatch('resetGame');
    }

    get hasWon() {
        return this.$store.getters.hasWon();
    }

    get isGameOver() {
        return this.$store.getters.isGameOver();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
