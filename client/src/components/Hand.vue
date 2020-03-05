<template>
  <div :class="['Hand', position]">
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
        :show="isPlayerHand"
      />
    </ul>
  </div>
</template>

<script>
import Tile from './Tile';
export default {
  props: ['hand', 'melds', 'isPlayerHand', 'position'],
  components: {Tile}
};
</script>

<style lang="scss">
$hand-width: 90%;
.Hand {
  border: 1px solid #bbb;
  border-radius: 5px;
  list-style-type: none;
  width: $hand-width;
  height: 3.3vw;
  display: flex;
  justify-content: space-between;
  position: absolute;

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

.Melds{
  min-width: 50x;
}
</style>