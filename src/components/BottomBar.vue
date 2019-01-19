<template>
    <g>
        <g transform="translate(1, 550)">
            <rect width="450" height="40" x="0" y="0" stroke="none" rx="3" ry="3" style="fill:#03dac5; filter:url(#shadow);" @click="onResetClick" />
            <text pointer-events="none" x="225" y="27" fill="black" font-weight="bold" text-anchor="middle">もういちどはじめる</text>
        </g>
    </g>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  methods: {
    onResetClick(e) {
        this.$store.dispatch('resetGame');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
