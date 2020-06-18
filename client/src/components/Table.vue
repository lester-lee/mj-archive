<template>
  <div class="Table">
    <Debug />
    <Windicator :wind="store.curWind" :dealer="getDealerPosition(store.playerNum,store.dealerNum)" />
    <div class="GameId">{{store.gameId}}</div>
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
      <div class="WinPrompter" @click="promptWin(store)">
        <Tile :tile="store.lastDiscard" :show="true" />
      </div>
      <Discard
        v-for="index in 4"
        :key="index"
        :tiles="store.discards[getHandPosition(
          store.playerNum, index-1
        )]"
        :position="positions[index-1]"
      />
    </div>
    <ActionMenu />
    <Prompt />
    <WinPrompt />
  </div>
</template>

<script>
import Tile from "./Tile";
import Hand from "./Hand";
import Discard from "./Discard";
import Windicator from "./Windicator";
import Debug from "./Debug";
import Prompt from "./Prompt";
import WinPrompt from "./WinPrompt";

export default {
  computed: {
    store: function() {
      return this.$root.$data;
    },
    positions: () => ["bottom", "right", "top", "left"]
  },
  methods: {
    getDealerPosition: function(p, d) {
      p = Number(p);
      d = Number(d);
      return (((p - d) % 4) + 4) % 4;
    },
    getHandPosition: function(p, i) {
      p = Number(p);
      i = Number(i);
      return (((i + p) % 4) + 4) % 4;
    },
    promptWin: store => {
      store.winPrompt = true;
      store.claimWin = true;
    }
  },
  components: {
    Debug,
    Tile,
    Hand,
    Discard,
    Windicator,
    Prompt,
    WinPrompt
  }
};
</script>

<style lang="scss">
.Table,
.PlayerHands {
  @include fill-parent;
}
.GameId{
  position: absolute;
  bottom: -$t-max-width;
  right: 10%;
}
.DiscardPile {
  @include center-in-parent;
  width: $d-width;
  max-width: $d-max-width;
  height: $d-width;
  max-height: $d-max-width;

  .WinPrompter {
    @include center-in-parent;
    width: 50px;

    img {
      max-width: 50px;
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>