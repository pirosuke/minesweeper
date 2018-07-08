<template>
  <svg id="app" width="300px" height="400px">
    <MenuBar />
    <CellList />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CellList from './components/CellList.vue';
import MenuBar from './components/MenuBar.vue';

@Component({
  components: {
    CellList,
    MenuBar,
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
