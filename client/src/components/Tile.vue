<template>
  <li :class="['Tile', canHover ? 'canHover' : '']">
    <img v-if="show" :src="tile.url" :alt="tile.suit + ':' + tile.rank"/>
    <img v-if="!show" :src="tile.downUrl" alt="Facedown tile"/>
  </li>
</template>

<script>
export default {
  props: ['tile', 'canHover', 'show']
}
</script>

<style lang="scss">
.Tile{
  user-select: none;
  display: inline-block;
  width: 50px;
  img {
    max-width: 100%;
  }
  &.canHover:hover{
    cursor: pointer;
    position: relative;
    top: -5px;
  }
  &.canHover:active{
    top: -10px;
  }
}

</style>