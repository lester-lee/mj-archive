<template>
  <div class="Table">
    <div class="PlayerHands">
      <Hand
        :hand="store.hands[store.playerNum]"
        :melds="store.melds[store.playerNum]"
        isPlayerHand="true"
        position="bottom"
      />
      <Hand
        v-for="(hand,index) in opponentHands"
        :key="index"
        :hand="opponentHands[index]"
        :melds="opponentMelds[index]"
        :position="positions[index+1]"
      />
      <!-- TODO: figure out corresponding positions -->
    </div>

    <div class="DiscardPile">
      <Discard
        v-for="(pile, index) in store.hands"
        :key="index"
        :tiles="store.hands[index]"
        :position="positions[index]"
      />
    </div>

    <Windicator
      :wind="store.curWind"
      :dealer="store.dealerNum"
    />

  </div>
</template>

<script>
import Tile from "./Tile";
import Hand from "./Hand";
import Discard from "./Discard";
export default {
  //props: ['hands', 'melds', 'discardPile', 'gameId', 'playerNum']
  computed: {
    store: function() {
      return this.$root.$data;
    },
    opponentHands: function() {
      let s = this.$root.$data;
      let hL = s.hands.slice(0,s.playerNum);
      let hR = s.hands.slice(s.playerNum+1);
      return hL.concat(hR);
    },
    opponentMelds: function() {
      let s = this.$root.$data;
      return s.melds.splice(s.playerNum, 1);
    },
    positions: () => ['bottom','left', 'top', 'right']
  },
  components: { Tile, Hand, Discard }
};
</script>

<style lang="scss">
.Table, .PlayerHands{
  @include fill-parent;
}
.DiscardPile{
  @include center-in-parent;
  width: $d-width;
  max-width: $d-max-width;
  height: $d-width;
  max-height: $d-max-width;
}
</style>