<script lang="ts">
  import {toFullKwhPrice, toGridKwhPrice} from './formatters'
  import type Config from './Config.ts'

  export let config: Config
  export let prices = Array(96).fill(0)
  export let dayOfWeek: number
  export let hour: number
  export let selectedHour: number
  export let withTax: boolean
  export let withGrid: boolean

  function selected(i: number) {
    selectedHour = Math.floor(i / 4)
  }
</script>

<ul class="day-prices">
  <div class="line" style="height: {toFullKwhPrice(config.comparisonPrice * 10, config.taxPercent, withTax) * 10}px"></div>
  {#each prices as p, i}
    {@const price = toFullKwhPrice(p, config.taxPercent, withTax)}
    {@const gridPrice = toGridKwhPrice(config.gridPriceDay, config.gridPriceNight, Math.floor(i / 4), dayOfWeek, config.taxPercent, withGrid, withTax)}
    {@const total = price + gridPrice}
    <li class:now={Math.floor(i / 4) === hour} class:full-hour={i % 4 === 0} on:click={() => selected(i)} style="cursor: pointer">
      <div class="bars" class:negative={total < 0}>
        <div class="grid" style="height: {gridPrice * 10}px"></div>
        <div class="electricity" style="height: {Math.abs(price) * 10}px"></div>
      </div>
      <div class="price">{i % 4 === 0 || i % 4 === 3 ? total.toFixed(1) : ''}</div>
      <div class="hour">{i % 4 === 1 ? config.toLocalHour(Math.floor(i / 4)) : ''}</div>
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
