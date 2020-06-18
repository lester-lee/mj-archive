<template>
  <div class="WinPrompt" v-if="store.winPrompt">
    <!-- Self Declare Win -->
    <div class="WinPromptText" v-if="store.claimWin">
      {{ !store.waitConfirm ?
        'Would you like to declare a win? Your hand will be shown to everyone.' :
        'Waiting for other responses...'
      }}
    </div>

    <ul class="WinPromptButtons" v-if="store.claimWin && !store.waitConfirm">
      <li class="WinPromptButton" @click="win(store)">Yes</li>
      <li class="WinPromptButton" @click="close(store)">No</li>
    </ul>

    <!-- Other Declare Win -->
    <div class="WinPromptText" v-if="!store.claimWin">
      {{ !store.waitConfirm ? 'Someone has declared a win!' :
        'Waiting for other responses...' }} <br>
      {{ !store.waitConfirm ? 'Click to proceed to the next game.' : ''}}
    </div>

    <ul class="WinPromptButtons" v-if="!store.claimWin && !store.waitConfirm">
      <li class="WinPromptButton" @click="proceed(store)">Proceed</li>
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
      store.waitConfirm = true;
      store.socket.emit('show hand', {
        gameId: store.gameId,
        playerNum: store.playerNum
      });
      store.socket.emit('claim win', {
        gameId: store.gameId,
        playerNum: store.playerNum
      });
    },
    close: store => {
      store.winPrompt = false;
    },
    proceed: store => {
      store.waitConfirm = true;
      store.socket.emit('proceed', {
        gameId: store.gameId,
        playerNum: store.playerNum
      });
    }
  }
};
</script>

<style lang="scss">
.WinPrompt {
  @include center-in-parent;
  top: 25%;

  width: 50%;

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
    justify-content: center;
  }

  &Button{
    padding: 10px 20px;
    margin: 0 30px;
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