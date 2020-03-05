<template>
  <div :class="['Hand', position]">
    <ul class="Melds">
      <Tile
        v-for="tile in melds"
        :key="tile.id"
        :tile="tile" :show="true"
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
  props: ["hand", "melds", "isPlayerHand", "position"],
  components: {Tile}
};
</script>

<style lang="scss">
.Hand {
  padding: 0;
  border: 1px solid #bbb;
  border-radius: 5px;
  list-style-type: none;
  width: 76%;
  display: flex;
  justify-content: space-between;
  position: absolute;
  ul {
    padding: 0;
    margin: 0;
  }

  &.bottom{
    bottom: 0;
    left: 12%;
  }

}
</style>