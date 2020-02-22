<template>
  <div class="Table">
    {{ gameId }}
  </div>
</template>

<script>
export default {
  //props: ['hands', 'melds', 'discardPile', 'gameId', 'playerNum']
  computed: {
    gameId: function () {
      return this.$root.$data.gameId;
    }
  }
}
</script>

<style>

</style>