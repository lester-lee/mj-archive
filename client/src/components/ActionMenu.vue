<template>
  <div class="ActionMenu">
    <div class="ActionMenuButton">
      Chow
    </div>
    <div class="ActionMenuButton">
      Pong
    </div>
    <div class="ActionMenuButton">
      Kong
    </div>
    <div class="ActionMenuButton" @click="showHand(store)">
      Show Hand
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    showHand: store => {
      store.socket.emit('show hand', {
        gameId: store.gameId,
        playerNum: store.playerNum
      });
    }
  },
  computed: {
    store: function(){
      return this.$root.$data;
    }
  }
}
</script>

<style lang="scss">
$action-width: 130px;

.ActionMenu{

  position: absolute;
  bottom: 0;
  right: -$action-width;

  &Button{
    text-align: center;
    width: 100px;
    height: 25px;
    background: white;
    color: #333;
    margin: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    &:hover{
      background: #ccc;
    }
    &:active{
      background: rgb(187, 245, 255);
    }
  }
}
</style>