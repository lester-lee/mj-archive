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

$font: Avenir, Helvetica, Arial, sans-serif;
$table-width: 1280px;
$table-height: 80vh;

#app {
  font-family: $font;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: (100vh - $table-height)/2 auto;
  width: 50%;
  min-width: $table-width;
  height: $table-height;
  border: 1px solid red;
  position: relative;
}

html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
body{
  margin: 0;
  height: 100%;
  background-color: #1c7448;
}
</style>
