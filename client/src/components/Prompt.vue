<template>
  <div class="Prompt" v-if="store.prompt">
    <div class="PromptClose" @click="act(store, 'prompt close')">×</div>
    <div class="DiscardDisplay">
      <Tile :tile="store.lastDiscard" :show="true" />
    </div>
    <ul class="PromptActions">
      <li class="PromptAction" v-if="store.canPong"
        @click="act(store, '碰')">碰</li>
      <li class="PromptAction" v-if="store.canGong"
        @click="act(store, '杠')">杠</li>
    </ul>
  </div>
</template>

<script>
import Tile from "./Tile";
export default {
  computed: {
    store: function() {
      return this.$root.$data;
    }
  },
  methods: {
    act: (store, action) => {
      store.prompt = false;
      store.socket.emit(action, {
        gameId: store.gameId,
        playerNum: store.playerNum
      });
    },
  },
  components: { Tile }
};
</script>

<style lang="scss">
$prompt-width: 200px;
.Prompt {
  @include center-in-parent;
  width: $prompt-width;
  height: $prompt-width;
  background: white;
  

  &Action, &Close {
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