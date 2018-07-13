<template>
    <g transform="translate(1, 1)">
        <g v-if="isGameOver">
            <g v-if="hasWon">
                <rect width="450" height="40" x="0" y="0" stroke="blue" fill="#fff" stroke-width="4" />
                <text pointer-events="none" x="5" y="25" stroke="none" fill="blue">ぜんぶあけた！あなたのかち！</text>
            </g>
            <g v-else>
                <rect width="450" height="40" x="0" y="0" stroke="red" fill="#fff" stroke-width="4" />
                <text pointer-events="none" x="5" y="25" stroke="none" fill="red">ざんねん！おとしあなだ！</text>
            </g>
        </g>
        <g v-else>
            <rect width="450" height="40" x="0" y="0" stroke="none" fill="#fff" stroke-width="1" />
            <text pointer-events="none" x="5" y="25" stroke="none">「おとしあな」におちないようにマスをあけてみよう</text>
        </g>
    </g>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MenuBar extends Vue {
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
