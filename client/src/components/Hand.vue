<template>
  <div :class="['Hand', position]">
    <div class="Name">{{ name }}</div>
    <ul class="Melds">
      <Tile
        v-for="tile in melds"
        :key="tile.id"
        :tile="tile"
        :show="true"
      />
    </ul>
    <ul>
      <Tile
        v-for="tile in hand"
        :key="tile.id"
        :tile="tile"
        :canHover="isPlayerHand"
        :show="isShowing || isPlayerHand"
        :canClick="isPlayerHand"
      />
    </ul>
  </div>
</template>

<script>
import Tile from './Tile';
export default {
  props: ['hand', 'melds', 'isPlayerHand', 'position', 'isShowing', 'name'],
  components: {Tile}
};
</script>

<style lang="scss">
.Hand {
  //border: 1px solid #bbb;
  //border-radius: 5px;

  width: $hand-width;
  height: $t-height;

  display: flex;
  justify-content: space-between;
  position: absolute;

  .Name{
    position: absolute;
    bottom: -1.2em;
    right: 0;
  }

  &.bottom{
    bottom: 0;
  }

  &.top{
    transform: rotate(180deg);
    right: 0;
  }

  &.left{
    transform: rotate(90deg) translateY(-100%);
    transform-origin: top left;
    left: 0px;
  }

  &.right{
    transform: rotate(-90deg);
    transform-origin: bottom left;
    right: -$hand-width;
    bottom: 0;
  }
}
</style>