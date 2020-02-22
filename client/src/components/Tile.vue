<template>
  <li class="Tile">
    <img :src="tile.url" :alt="tile.suit + ':' + tile.rank"/>
  </li>
</template>

<script>
export default {
  props: ['tile']
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