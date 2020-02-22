<template>
  <div class="Table">
    {{ store }}
  </div>
</template>

<script>
export default {
  //props: ['hands', 'melds', 'discardPile', 'gameId', 'playerNum']
  computed: {
    store: function () {
      return this.$root.$data;
    },
    gameId: function () {
      return this.$root.$data.gameId;
    }
  }
}
</script>

<style>

</style>