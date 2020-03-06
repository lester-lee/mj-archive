<template>
  <div class="Table">
    <div class="PlayerHands">
      <Hand
        v-for="(hand,index) in store.hands"
        :key="index"
        :hand="store.hands[getHandPosition(
          store.playerNum, index
        )]"
        :melds="store.melds[getHandPosition(
          store.playerNum, index
        )]"
        :position="positions[index]"
        :isPlayerHand="index==0"
      />
    </div>
    <div class="DiscardPile">
      <Discard
        v-for="(pile, index) in store.discards"
        :key="index"
        :tiles="store.discards[getHandPosition(
          store.playerNum, index
        )]"
        :position="positions[index]"
      />
    </div>
    <Windicator
      :wind="store.curWind"
      :dealer="getDealerPosition(store.playerNum,store.dealerNum)"
    />
  </div>
</template>

<script>
import Tile from "./Tile";
import Hand from "./Hand";
import Discard from "./Discard";
import Windicator from "./Windicator";
export default {
  computed: {
    store: function() {
      return this.$root.$data;
    },
    opponentHands: function() {
      let s = this.$root.$data;
      let hL = s.hands.slice(0, s.playerNum);
      let hR = s.hands.slice(s.playerNum + 1);
      return hL.concat(hR);
    },
    opponentMelds: function() {
      let s = this.$root.$data;
      return s.melds.splice(s.playerNum, 1);
    },
    positions: () => ["bottom", "right", "top", "left"]
  },
  methods: {
    getDealerPosition: function(p, d){
      return (((p-d) % 4) + 4) % 4;
    },
    getHandPosition: function(p, i){
      return (((p+i) % 4) + 4) % 4;
    }
  },
  components: { Tile, Hand, Discard, Windicator }
};
</script>

<style lang="scss">
.Table,
.PlayerHands {
  @include fill-parent;
}
.DiscardPile {
  @include center-in-parent;
  width: $d-width;
  max-width: $d-max-width;
  height: $d-width;
  max-height: $d-max-width;
}
</style>