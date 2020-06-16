<template>
  <div>
    <div class="Login" v-if="!store.inLobby">
      <form>
        <div class="LoginField">
          <label for="username">Username</label>
          <input
            :class="usernameError ? 'LoginError' : ''"
            type="text"
            id="username"
            v-model="store.username"
            required
          />
        </div>
        <div class="LoginField">
          <label for="gameId">Game ID</label>
          <input type="text" id="gameId" v-model="store.gameId" />
        </div>
        <button v-if="!store.lobby.readyToStart" type="submit" @click.stop.prevent="login()">Login</button>
      </form>
    </div>
    <div class="Login" v-if="store.inLobby">
      <div
        class="LoginField"
        v-if="store.lobby.numPlayers > 0 && store.lobby.numPlayers < 4"
      >Waiting for {{ 4 - store.lobby.numPlayers }} more...</div>
      <ul>
        <li v-for="(player, index) in store.lobby.players" :key="index">{{player}}</li>
      </ul>
      <button v-if="store.lobby.readyToStart" type="submit" @click.stop.prevent="goToTable()">Play!</button>
    </div>
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
      if (store.username) {
        store.inLobby = true;
        store.socket.emit("login", {
          username: store.username,
          gameId: store.gameId
        });
      } else {
        this.usernameError = true;
      }
    },
    goToTable: function() {
      let store = this.$root.$data;
      store.socket.emit("join game", store.gameId);
      this.$router.push("/table");
    }
  }
};
</script>

<style lang="scss">
.Login {
  width: 200px;
  height: 200px;
  margin: 20vh auto;
  color: $background-color;
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