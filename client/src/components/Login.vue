<template>
  <div class="Login">
    <div class="LoginField">
      <label for="username">Username</label>
      <input type="text" id="username" v-model="store.username" required />
    </div>
    <div class="LoginField">
      <label for="gameId">Game ID</label>
      <input type="text" id="gameId" v-model="store.gameId"/>
    </div>
    <router-link to="/table">Play!</router-link>
  </div>
</template>

<script>
export default {
  name: "Login",
  computed: {
    store: function() {
      return this.$root.$data;
    }
  }
};
</script>

<style lang="scss">
.Login{
  width: 200px;
  height: 200px;
  margin: 20vh auto;
  &Field{
    display: flex;
    flex-flow: column;

    text-align: left;
    margin: 10px 0;
  }
}
</style>