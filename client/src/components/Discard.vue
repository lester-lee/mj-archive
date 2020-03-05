<template>
  <ul :class="['Discard',position]">
    <Tile
      v-for="tile in tiles"
      :key="tile.id"
      :tile="tile"
      :show="true"
    />
  </ul>
</template>

<script>
import Tile from './Tile';
export default {
  props:['tiles','position'],
  components: {Tile}
}
</script>

<style lang="scss">
.Discard{
  width: 180px;
  max-width: 28vw;
  height: 3.3vw;
  position: absolute;
  display: flex;
  flex-flow: wrap;

  &.bottom{
    bottom: -3.3vw;
  }

  &.top{
    transform: rotate(180deg);
    right: 0;
    top: -3.3vw;
  }

  &.left{
    transform: rotate(90deg) translateY(-100%);
    transform-origin: top left;
    left: -3.3vw;
  }

  &.right{
    transform: rotate(-90deg);
    transform-origin: bottom left;
    right: calc(-100% - 3.5vw);
    bottom: 0;
  }
}
</style>