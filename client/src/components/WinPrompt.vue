<template>
  <div class="WinPrompt" v-if="store.winPrompt">
    <div class="WinPromptText">Do you win off this discard? Your hand will be shown to everyone.</div>
    <ul class="WinPromptButtons">
      <li class="WinPromptButton">Yes</li>
      <li class="WinPromptButton" @click="close(store)">No</li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    store: function() {
      return this.$root.$data;
    }
  },
  methods: {
    win: store => {
      store.socket.emit("show hand", {
        gameId: store.gameId,
        playerNum: store.playerNum
      });
    },
    close: store => {
      store.winPrompt = false;
    }
  }
};
</script>

<style lang="scss">
.WinPrompt {
  @include center-in-parent;
  top: 33%;

  &Text{
    background: $accent2-color;
    transform: skew(-18deg);
    padding: 10px;
  }

  text-align: center;

  &Buttons{
    display: flex;
    width: 50%;
    margin: 20px auto;
    justify-content: space-between;
  }

  &Button{
    padding: 10px 20px;
    background: rgba($color: $accent2-color, $alpha: 0.8);
    border: 1px solid $accent2-color;

    &:hover{
      cursor: pointer;
      border: 1px solid $accent-color;
      background: $accent2-color;
    }
  }
}
</style>