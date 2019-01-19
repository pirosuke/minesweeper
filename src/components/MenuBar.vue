<template>
    <g transform="translate(1, 1)">
        <g class="message-block">
            <g v-if="isGameOver">
                <g v-if="hasWon">
                    <rect width="450" height="40" x="0" y="0" stroke="none" fill="#3700b3" />
                    <text pointer-events="none" x="225" y="25" stroke="none" fill="#fff" text-anchor="middle">ぜんぶあけた！あなたのかち！</text>
                </g>
                <g v-else>
                    <rect width="450" height="40" x="0" y="0" stroke="none" fill="#c51162" stroke-width="4" />
                    <text pointer-events="none" x="225" y="25" stroke="none" fill="#fff" text-anchor="middle">ざんねん！おとしあなだ！</text>
                </g>
            </g>
            <g v-else>
                <rect width="450" height="40" x="0" y="0" stroke="none" fill="#fff" stroke-width="1" />
                <text pointer-events="none" x="225" y="25" stroke="none" text-anchor="middle">「おとしあな」におちないようにマスをあけてみよう</text>
            </g>
        </g>
        <g transform="translate(0, 45)">
            <rect width="100" height="35" x="0" y="0" rx="3" ry="3" stroke="#ccc" stroke-width="1" style="fill:#fff; filter:url(#small-shadow);" />
            <text pointer-events="none" x="90" y="25" font-size="20" text-anchor="end">{{mineNum}}</text>
            <rect width="100" height="35" x="350" y="0" rx="3" ry="3" stroke="#ccc" stroke-width="1" style="fill:#fff; filter:url(#small-shadow);" />
            <text pointer-events="none" x="440" y="25" font-size="20" text-anchor="end">{{remainingOpenableCellNum}}</text>
        </g>
    </g>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    hasWon() {
        return this.$store.getters.hasWon();
    },

    isGameOver() {
        return this.$store.getters.isGameOver();
    },

    mineNum() {
        return this.$store.getters.getMaxMineNum();
    },

    remainingOpenableCellNum() {
        const remainingNum = this.$store.getters.getRemainingOpenableCellNum();
        return remainingNum >= 0 ? remainingNum : 0;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
