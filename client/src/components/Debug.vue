<template>
  <div class="Debug">
      <div class="DebugField">
        <label for="username">Username</label>
        <input :class="usernameError ? 'LoginError' : ''" type="text" id="username" v-model="store.username" required />
      </div>
      <div class="DebugField">
        <label for="gameId">Game ID</label>
        <input type="text" id="gameId" v-model="store.gameId" />
      </div>
      <div class="DebugField">
        <label for="playerNum">PlayerNum</label>
        <input type="number" id="playerNum" v-model="store.playerNum" />
      </div>
      <div class="DebugField">
        <label for="myTurn">My Turn</label>
        <input type="checkbox" id="myTurn" v-model="store.myTurn" />
      </div>
      <div class="DebugField">
        <label for="curWind">Wind</label>
        <input type="number" id="curWind" v-model="store.curWind" />
      </div>
      <div class="DebugField">
        <label for="dealerNum">Dealer</label>
        <input type="number" id="dealerNum" v-model="store.dealerNum" />
      </div>
  </div>
</template>

<script>
export default {
  computed: {
    store: function() {
      return this.$root.$data;
    }
  }
}
</script>

<style lang="scss">
.Debug{
  position: relative;
  left: -300px;
}
</style>