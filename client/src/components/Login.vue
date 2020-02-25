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
      <button type="submit" @click.stop.prevent="goToTable()">Play!</button>
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
    goToTable: function() {
      if(this.$root.$data.username){
        this.$router.push("/table");
      }else{
        this.usernameError = true;
      }
    }
  }
};
</script>

<style lang="scss">
.Login {
  width: 200px;
  height: 200px;
  margin: 20vh auto;
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