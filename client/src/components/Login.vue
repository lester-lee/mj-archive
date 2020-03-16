<template>
  <div class="Login">
    <form>
      <div class="LoginField">
        <label for="username">Username</label>
        <input :class="usernameError ? 'LoginError' : ''" type="text" id="username" v-model="store.username" required />
      </div>
      <div class="LoginField">
        <label for="gameId">Game ID</label>
        <input type="text" id="gameId" v-model="store.gameId" />
      </div>
      <button type="submit" @click.stop.prevent="login()">Login</button>
      <div class="LoginField" v-if="store.lobby.numPlayers > 0">Waiting for {{ 4 - store.lobby.numPlayers }} more people...
      </div>
      <button v-if="store.lobby.readyToStart" type="submit" @click.stop.prevent="goToTable()">Play!</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: function() {
    return { usernameError: false };
  },
  computed: {
    store: function() {
      return this.$root.$data;
    }
  },
  methods: {
    login: function() {
      let store = this.$root.$data;
      if(store.username){
        store.socket.emit('login', {
          username: store.username,
          gameId: store.gameId
        });
      }else{
        this.usernameError = true;
      }
    },
    goToTable: function(){
      store.socket.emit('join game', {
          username: store.username,
          gameId: store.gameId
        });
      this.$router.push('/table');
    }
  }
};
</script>

<style lang="scss">
.Login {
  width: 200px;
  height: 200px;
  margin: 20vh auto;
  color: $text-color;
  &Field {
    display: flex;
    flex-flow: column;

    text-align: left;
    margin: 10px 0;
  }
  &Error {
    border: 1px solid red;
  }
}
</style>