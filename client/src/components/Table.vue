<template>
  <div class="Table">
    <ul class="Hand"
      v-for="(hand,index) in store.hands"
      v-bind:key="index"
    >
      <div class="Melds">
      <Tile
        v-for="tile in store.melds[index]"
        :key="tile.id"
        :tile="tile"
        :show="true"
      />
      </div>
      <div>
      <Tile
        v-for="tile in hand"
        :key="tile.id"
        :tile="tile"
        :canHover="index === store.playerNum ? true : false"
        :show="index === store.playerNum ? true : false"
      />
      </div>
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
  display: flex;
  justify-content: space-between;
}

</style>