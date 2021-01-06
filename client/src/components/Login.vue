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
            placeholder="username"
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
        v-if="store.lobby.numPlayers > 0 && store.lobby.numPlayers < 4"
      >
      Game ID: <span>{{ store.gameId }}</span><br>
      Waiting for {{ 4 - store.lobby.numPlayers }} more...</div>
      <ul>
        <li v-for="(player, index) in store.lobby.players" :key="index"
          :class="['PlayerName',
            store.confirmCheck[index] > 0 ? '--active' : '']">
          {{player}}
        </li>
      </ul>
      <button id="ready" v-if="store.lobby.readyCheck" type="submit" @click.stop.prevent="sendReady()">Ready!</button>
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
    sendReady: function() {
      let store = this.$root.$data;
      let router = this.$router;
      store.socket.emit("lobby ready", {
        username: store.username,
        gameId: store.gameId
      });

      // Keep checking if game start
      let startCheckInterval;
      let startCheck = function(){
        if(store.gameStart){
          router.push('/table');
          clearInterval(startCheckInterval);
          store.gameStart = false;
        }
      }
      startCheckInterval = setInterval(startCheck, 500);
    }
  }
};
</script>

<style lang="scss">
.Login {
  width: 400px;
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

  .PlayerName.--active{
    font-style: italic;
  }
}
</style>