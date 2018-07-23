<template>
  <svg id="app" width="500px" height="600px">
    <defs>
      <filter id="shadow" width="100" height="100">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feOffset dx="1" dy="3" result="offsetBlur" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="small-shadow" width="100" height="100">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
        <feOffset dx="0" dy="1" result="offsetBlur" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <linearGradient id="cellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#feb" />
        <stop offset="100%" stop-color="#fd9" />
    </linearGradient>
    <MenuBar />
    <CellList />
    <BottomBar />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CellList from './components/CellList.vue';
import MenuBar from './components/MenuBar.vue';
import BottomBar from './components/BottomBar.vue';

@Component({
  components: {
    CellList,
    MenuBar,
    BottomBar,
  },
})
export default class App extends Vue {
  public created() {
    this.$store.dispatch('resetGame');
  }
}
</script>

<style>
#app {
}
</style>
