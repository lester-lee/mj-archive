<template>
  <div class="ActionMenu">
    <div class="ActionMenuButton" v-if="store.canChow"
      @click="act(store, '上')">上</div>
    <div class="ActionMenuButton" v-if="store.canPong"
      @click="act(store, '碰')">碰</div>
    <div class="ActionMenuButton" v-if="store.canGong"
      @click="act(store, '杠')">杠</div>
    <div class="ActionMenuButton" @click="showHand(store)">Show Hand</div>
    <div
      class="ActionMenuButton --big"
      v-if="store.myTurn && !store.canDiscard"
      @click="act(store, 'draw')"
    >Draw</div>
  </div>
</template>

<script>
export default {
  methods: {
    showHand: store => {
      store.socket.emit("show hand", {
        gameId: store.gameId,
        playerNum: store.playerNum
      });
    },
    act: (store, action) => {
      store.canDiscard = true;
      store.socket.emit(action, {
        gameId: store.gameId,
        playerNum: store.playerNum
      });
    }
  },
  computed: {
    store: function() {
      return this.$root.$data;
    }
  }
};
</script>

<style lang="scss">
$action-width: 130px;

.ActionMenu {
  position: absolute;
  bottom: 0;
  right: -$action-width;

  &Button {
    text-align: center;
    width: 100px;
    height: 25px;
    background: white;
    color: #333;
    margin: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background: #ccc;
    }
    &:active {
      background: rgb(187, 245, 255);
    }

    &.--big {
      height: 50px;
    }
  }
}
</style>