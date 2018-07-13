<template>
  <svg id="app" width="500px" height="600px">
    <linearGradient id="btnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#eee" />
        <stop offset="50%" stop-color="#ccc" />
        <stop offset="51%" stop-color="#bbb" />
        <stop offset="100%" stop-color="#999" />
    </linearGradient>
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
