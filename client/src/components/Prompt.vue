<template>
  <div class="Prompt" v-if="store.prompt">
    <div class="PromptClose" @click="act(store, 'prompt close')">×</div>
    <div class="DiscardDisplay">
      <Tile :tile="store.lastDiscard" :show="true" />
    </div>
    <ul class="PromptActions">
      <div v-if="store.waitPong"> Wait! Someone may 碰.</div>
      <div class="ChowActions" v-if="store.canChow">
        <li class="PromptAction" v-for="index in 3" :key="index"
          @click="act(store, '上', {chowType: index})">
          <span v-if="chowTiles(index-1).length > 0" style="width:35px">上</span>
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
  background: $table-color;
  text-align: center;

  border-radius: 20px;
  border: 10px solid $accent-color;
  padding: 10px;

  font-size: 1.5em;

  .DiscardDisplay{
    margin: 20px 0;
  }

  &Close {
    position: absolute;
    top: 0;
    right: 0;

    width: 50px;
    height: 50px;

    font-size: 2em;
    color: rgb(214, 89, 72);

    cursor: pointer;

    &:hover {
      color: rgb(173, 71, 53);
    }
    &:active {
      color: rgb(160, 36, 36);
    }
  }

  &Action{
    display: flex;
    justify-content: center; 
    align-items: center;
    width: 50%;
    margin: 10px auto;

    border-radius: 20px;
    line-height: $t-height + 5px;

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