<template>
  <div class="Prompt" v-if="store.prompt">
    <div class="PromptClose" @click="act(store, 'prompt close')">×</div>
    <div class="DiscardDisplay">
      <Tile :tile="store.lastDiscard" :show="true" />
    </div>
    <ul class="PromptActions">
      <div v-if="store.waitPong"> Wait! Someone may 碰.</div>
      <div class="ChowActions" v-if="store.canChow">
        上
        <li class="PromptAction" v-for="index in 3" :key="index"
          @click="act(store, '上', {chowType: index})">
          <Tile v-for="t in chowTiles(index-1)"
          :key="t.id" :tile="t" :show="true"/>
        </li>
      </div>
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
    },
  },
  methods: {
    act: (store, action, options={}) => {
      store.prompt = false;
      store.socket.emit(action, {
        gameId: store.gameId,
        playerNum: store.playerNum,
        options: options
      });
    },
    chowTiles: function(i) {
      return this.$root.$data.chowTiles[i];
    }
  },
  components: { Tile }
};
</script>

<style lang="scss">
$prompt-width: 400px;
.Prompt {
  @include center-in-parent;
  width: $prompt-width;
  height: $prompt-width;
  background: white;
  text-align: center;

  .DiscardDisplay{
    margin: 30px 0;
  }

  &Close {
    position: absolute;
    top: 0;
    right: 0;
  }

  &Action, &Close {
    text-align: center;
    background: white;
    color: #333;
    margin: 5px;
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