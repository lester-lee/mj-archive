<template>
  <div class="ActionMenu">
    <div class="ActionMenuButton" @click="showHand(store)">Show Hand</div>
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
  left: -$action-width;

  &Button {
    display: flex;
    justify-content: center; 
    align-items: center;

    width: 100px;
    height: 45px;
    border-radius: 20px;
    
    background: rgba(255, 255, 255, 0.1);
    color: $background-color;


    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    &:active {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}
</style>