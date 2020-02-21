<template>
  <div class="Login">
    <form action>
      <div class="LoginField">
        <label for="username">Username</label>
        <input type="text" id="username" />
      </div>
      <button type="submit">Play!</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login"
};
</script>

<style lang="scss">
.Login{
  width: 200px;
  margin: 20vh auto;
  &Field{
    display: flex;
    flex-flow: column;

    text-align: left;
    margin: 10px 0;
  }
}
</style>