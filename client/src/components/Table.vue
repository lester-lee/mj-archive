<template>
  <div class="Table">
    <Debug />
    <div class="PlayerHands">
      <Hand
        v-for="index in 4"
        :key="index"
        :name="store.lobby.players[getHandPosition(
          store.playerNum, index-1
        )]"
        :hand="store.hands[getHandPosition(
          store.playerNum, index-1
        )]"
        :melds="store.melds[getHandPosition(
          store.playerNum, index-1
        )]"
        :position="positions[index-1]"
        :isPlayerHand="index-1==0"
        :isShowing="store.shownHands[getHandPosition(
          store.playerNum, index-1
        )] > 0"
        :isCurrent="store.curPlayer ==
        getHandPosition(store.playerNum, index-1)"
      />
    </div>
    <div class="DiscardPile">
      <Discard
        v-for="index in 4"
        :key="index"
        :tiles="store.discards[getHandPosition(
          store.playerNum, index-1
        )]"
        :position="positions[index-1]"
      />
    </div>
    <Windicator
      :wind="store.curWind"
      :dealer="getDealerPosition(store.playerNum,store.dealerNum)"
    />
    <ActionMenu />
    <Prompt />
  </div>
</template>

<script>
import Tile from './Tile';
import Hand from './Hand';
import Discard from './Discard';
import Windicator from './Windicator';
import Debug from './Debug';
import ActionMenu from './ActionMenu';
import Prompt from './Prompt';

export default {
  computed: {
    store: function() {
      return this.$root.$data;
    },
    positions: () => ['bottom', 'right', 'top', 'left']
  },
  methods: {
    getDealerPosition: function(p, d){
      p = Number(p);
      d = Number(d);
      return (((p-d) % 4) + 4) % 4;
    },
    getHandPosition: function(p, i){
      p = Number(p);
      i = Number(i);
      return (((i+p) % 4) + 4) % 4;
    }
  },
  components: { Debug, Tile, Hand, Discard, Windicator, ActionMenu, Prompt }
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