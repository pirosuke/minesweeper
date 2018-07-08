<template>
    <g>
        <rect width="50" height="30" x="0" y="0" stroke="black" fill="#ccc" stroke-width="1" @click="onResetClick" />
        <text pointer-events="none" x="5" y="20">reset</text>
    </g>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MenuBar extends Vue {
    public onResetClick(e: any) {
        this.$store.dispatch('resetGame');
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
