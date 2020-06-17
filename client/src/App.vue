<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style lang="scss">

#app {
  @include center-in-parent;
  font-family: $font;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: auto;
  width: $table-width;
  height: $table-width;
  color: #eee;
  //border: 1px solid red;
}

html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
body{
  margin: 0;
  height: 100vh;
  background-color: $table-color;
}

ul{
  padding: 0;
  margin: 0;
}
</style>
