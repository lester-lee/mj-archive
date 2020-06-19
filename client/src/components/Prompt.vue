<template>
  <div class="Prompt" v-if="store.prompt">
    <div class="PromptText" v-if="store.waitPong"> Wait! Someone may 碰.</div>
    <ul class="PromptActions">
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
      <li class="PromptAction --close" 
        @click="act(store, 'prompt close')">ㄨ</li>
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
  width: 30%;
  position: absolute;
  bottom: 0;
  right: -35%;

  font-size: 1.5em;

  &Text{
    position: relative;
    text-align: right;
    margin-bottom: 10px;

    background: rgba($color: $accent2-color, $alpha: 0.8);
    padding-right: 5px;
  }

  &Actions{
    display: flex;
    flex-flow: column; 
  }

  &Action{
    border: 1px solid $accent2-color;
    background: rgba($color: $accent2-color, $alpha: 0.8);

    margin-top: 8px;
    width: $t-max-width * 3;
    height: $t-height * 1.2;

    transform: skew(-18deg);

    display: flex;
    align-items: center;
    padding-left: 15px;

    &.--close{
      border: 1px solid red;
      background: rgba($color: red, $alpha: 0.2)
    }

    &:hover{
      cursor: pointer;
      border: 1px solid $accent-color;
    }

  }
}

.ChowActions .PromptAction{
  width: $t-max-width * 5;
  margin-top: 10px;

  &:empty{
    display: none;
  }
}
</style>