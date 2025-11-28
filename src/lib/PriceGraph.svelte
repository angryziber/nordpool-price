<script lang="ts">
  import Config, {pricesPerHour} from './Config.ts'

  export let config: Config
  export let prices: number[]
  export let dayOfWeek: number
  export let hour: number

  function selected(i: number) {
    hour = Math.floor(i / pricesPerHour)
  }
</script>

<ul class="day-prices">
  <div class="line" style="height: {config.toKWhPrice(config.comparisonPrice * 10) * 10}px"></div>
  {#each prices as p, i}
    {@const indexInHour = i % pricesPerHour}
    {@const price = config.toKWhPrice(p)}
    {@const gridPrice = config.withGrid ? config.gridPrice(Math.floor(i / pricesPerHour), dayOfWeek) : 0}
    {@const total = price + gridPrice}
    <li class:now={Math.floor(i / pricesPerHour) === hour} class:full-hour={i % 4 === 0} on:click={() => selected(i)} style="cursor: pointer">
      <div class="bars" class:negative={total < 0}>
        <div class="grid" style="height: {gridPrice * 10}px"></div>
        <div class="electricity" style="height: {Math.abs(price) * 10}px"></div>
      </div>
      <div class="price">{indexInHour === 0 || indexInHour === 3 ? total.toFixed(1) : ''}</div>
      <div class="hour">{indexInHour === 1 ? config.toLocalHour(Math.floor(i / pricesPerHour)) : ''}</div>
    </li>
  {/each}
</ul>

<style>
  .day-prices {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 1em;
    display: flex;
    justify-content: space-between;
    list-style: none;
    height: 40vh;
    min-height: 200px;
    font-size: 80%;
  }

  li {
    display: flex;
    position: relative;
    height: 100%;
    width: 5%;
  }

  li.full-hour {
    margin-left: 0.3%;
  }

  .price, .bars {
    position: absolute;
    bottom: 0;
    left: 0; right: 0;
  }

  .price {
    transform: rotate(-90deg);
  }

  .bars {
    z-index: -1;
    height: 100%;
    transform-origin: top;
    transform: scaleY(-1) translateY(-100%);
  }

  .bars.negative {
    transform: translateY(100%);
  }

  .bars .electricity, .bars .grid {
    height: 0;
    transition: height 0.4s 0.1s;
    width: 100%;
  }

  .bars .electricity {
    background: lightblue;
  }

  .bars .grid {
    background: lightpink;
  }

  .now .bars .electricity {
    background: lightgreen;
  }

  .hour, .line {
    position: absolute;
    bottom: -1.5em;
    white-space: nowrap;
    left: 0; right: 0;
    color: gray;
  }

  .line {
    border-top: 1px dashed red;
  }
</style>
