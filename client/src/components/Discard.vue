<template>
  <ul :class="['Discard',position]">
    <Tile
      v-for="tile in tiles"
      :key="tile.id"
      :tile="tile"
      :show="true"
      :canClick="false"
      :canHover="false"
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
  width: $d-width;
  max-width: $d-max-width;
  height: $t-height;

  position: absolute;
  display: flex;
  flex-flow: wrap;

  &.bottom{
    bottom: -$t-height;
  }

  &.top{
    transform: rotate(180deg);
    right: 0;
    top: -$t-height;
  }

  &.left{
    transform: rotate(90deg) translateY(-100%);
    transform-origin: top left;
    left: -$t-height;
  }

  &.right{
    transform: rotate(-90deg);
    transform-origin: bottom left;
    right: calc(-100% - #{$t-height});
    bottom: 0;
  }
}
</style>