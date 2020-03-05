<template>
  <div class="Table">
    <div class="PlayerHands">
      <Hand
        :hand="store.hands[store.playerNum]"
        :melds="store.melds[store.playerNum]"
        :isPlayerHand="true"
        position="bottom"
      />


<!--
      <ul class="Hand" v-for="(hand,index) in store.hands" v-bind:key="index">
        <div class="Melds">
          <Tile v-for="tile in store.melds[index]" :key="tile.id" :tile="tile" :show="true" />
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
-->
    </div>

    <ul class="DiscardPile">
      <ul class="Hand" v-for="(pile, index) in store.discardPile" v-bind:key="index">
        <Tile
          v-for="tile in pile"
          :key="tile.id"
          :tile="tile"
          :show="true"
        />
      </ul>
    </ul>
  </div>
</template>

<script>
import Tile from "./Tile";
import Hand from "./Hand";
export default {
  //props: ['hands', 'melds', 'discardPile', 'gameId', 'playerNum']
  computed: {
    store: function() {
      return this.$root.$data;
    }
  },
  components: { Tile, Hand }
};
</script>

<style lang="scss">
.Table, .PlayerHands{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>