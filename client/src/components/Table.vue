<template>
  <div class="Table">
    <ul class="Hand"
      v-for="(hand,index) in store.hands"
      v-bind:key="index"
    >
      <Tile
        v-for="tile in hand"
        v-bind:key="tile.id"
        :tile="tile"
      />
    </ul>
  </div>
</template>

<script>
import Tile from './Tile';
export default {
  //props: ['hands', 'melds', 'discardPile', 'gameId', 'playerNum']
  computed: {
    store: function () {
      return this.$root.$data;
    }
  },
  components: {
    Tile
  }
}
</script>

<style>
.Hand{
  padding: 0;
  border: 1px solid #bbb;
  border-radius: 5px;
  list-style-type: none;
  width: 75%;
}

</style>