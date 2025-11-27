<script lang="ts">
  import { toFullKwhPrice, toGridKwhPrice, toLocalHour } from './formatters'
  import { createEventDispatcher } from 'svelte'

  export let prices = Array(96).fill(0)
  export let dayOfWeek: number
  export let hour: number
  export let hourDiff: number
  export let taxPercent: number
  export let comparisonPrice: number
  export let withTax: boolean
  export let gridPriceDay: number
  export let gridPriceNight: number
  export let withGrid: boolean

  const dispatch = createEventDispatcher()

  function selected(h: number) {
    dispatch('selected', h)
  }
</script>

<ul class="day-prices">
  <div class="line" style="height: {toFullKwhPrice(comparisonPrice * 10, taxPercent, withTax) * 10}px"></div>
  {#each prices as p, i}
    {@const price = toFullKwhPrice(p, taxPercent, withTax)}
    {@const gridPrice = toGridKwhPrice(gridPriceDay, gridPriceNight, Math.floor(i / 4), dayOfWeek, taxPercent, withGrid, withTax)}
    {@const total = price + gridPrice}
    <li class:now={Math.floor(i / 4) === hour} class:full-hour={i % 4 === 0} on:click={() => selected(i)} style="cursor: pointer">
      <div class="bars">
        <div class="electricity" class:negative={total < 0} style="height: {Math.abs(price) * 10}px"></div>
        <div class="grid" style="height: {gridPrice * 10}px"></div>
      </div>
      <div class="price">{i % 4 === 0 || i % 4 === 3 ? total.toFixed(1) : ''}</div>
      <div class="hour">{i % 4 === 1 ? toLocalHour(Math.floor(i / 4), hourDiff) : ''}</div>
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
    display: flex;
    flex-direction: column;
    justify-content: end;
    height: 100%;
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

  .bars .negative {
    transform-origin: bottom;
    transform: scaleY(-1);
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
