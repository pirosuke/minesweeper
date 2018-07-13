<template>
    <g>
        <g transform="translate(1, 550)">
            <rect width="450" height="40" x="0" y="0" stroke="#666" fill="url(#btnGrad)" stroke-width="3" @click="onResetClick" />
            <text pointer-events="none" x="140" y="25" font-weight="bold">もういちどはじめる</text>
        </g>
    </g>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class BottomBar extends Vue {
    public onResetClick(e: any) {
        this.$store.dispatch('resetGame');
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
