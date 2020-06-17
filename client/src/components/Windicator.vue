<template>
  <div class="Windicator">
    <div :class="['PlayerWindList', `--dealer${dealer}`]">
      <div
        v-for="(wind, index) in winds"
        :key="index"
        :class="['PlayerWind', positions[index]]"
      >
        {{ winds[index] }}
      </div>
    </div>
    <span class="RoundWind">{{ winds[wind] }}</span>
  </div>
</template>

<script>
import Tile from './Tile';
export default {
  props: ['wind', 'dealer'],
  computed: {
    winds: () => ['東', '南', '西', '北'],
    positions: () => ['bottom','right', 'top', 'left'],
    store: function() {
      return this.$root.$data;
    }
  },
  components: {Tile}
}
</script>

<style lang="scss">
$w-text-size: 20px;
.Windicator{
  width: $d-width / 2;
  max-width: $d-max-width / 2;
  height: $d-width / 2;
  max-height: $d-max-width / 2;

  position: absolute;
  bottom: 10%;
  right: 10%;
}
.RoundWind{
  @include center-in-parent;
  top: 49%;
  font-size: $w-text-size*2.5;
}
.PlayerWindList{
  font-size: $w-text-size;
  width: 100%;
  height: 100%;

  @for $i from 0 through 4{
    &.--dealer#{$i}{
      transform: rotate(#{$i * 90}deg);
      transform-origin: center;
    }
  }

  .PlayerWind{
    position: absolute;
    text-align: center;
    width: 100%;
    height: $w-text-size + 6px;
    &.bottom{
      bottom: 0;
    }
    &.top{
      transform: rotate(180deg);
      top: 0;
    }
    &.left{
      transform: rotate(90deg) translateX(-$w-text-size - 6px);
      transform-origin: bottom left;
    }
    &.right{
      transform: rotate(-90deg) translateX($w-text-size + 6px);
      transform-origin: bottom right;
    }
  }
}
</style>
