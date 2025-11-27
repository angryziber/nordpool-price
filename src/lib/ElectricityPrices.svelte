<script lang="ts">
  import {toFullKwhPrice, toLocalHour} from './formatters'
  import countries from './countries'
  import PriceCard from './PriceCard.svelte'
  import PriceGraph from './PriceGraph.svelte'
  import CountrySelect from './CountrySelect.svelte'
  import CostCalculator from './CostCalculator.svelte'
  import {config, gridPrice} from "./config.ts";

  const cetDate = toCET(new Date())

  let country = (localStorage.getItem('country') || 'EE') as keyof typeof countries
  let dayPrices: Record<string, number[]>
  let day = cetDate.toLocaleDateString('lt')
  let graphDay = day
  let hour = cetDate.getHours()
  let calcHour = hour
  let index = hour * 4 + Math.floor(cetDate.getMinutes() / 15)
  let withTax = true
  let withGrid = false
  let hourDiff = 1

  async function loadPrices() {
    dayPrices = await fetch(`/api/prices?country=${country}`).then(res => res.json())
  }

  $: changeCountry(country)

  function changeCountry(country: keyof typeof countries) {
    hourDiff = countries[country].hourDiff
    loadPrices()
    localStorage.setItem('country', country)
  }

  function price(i = index) {
    const ps = dayPrices
    let d = day
    if (!ps[d]) return 0
    const currentDayPrices = ps[d]
    if (i > currentDayPrices.length - 1) {
      d = Object.keys(ps)[0]
      i -= currentDayPrices.length
    } else if (i < 0) {
      d = Object.keys(ps)[1]
      i += currentDayPrices.length
    }
    return toFullKwhPrice(ps[d]?.[i] || 0, config.taxPercent, withTax)
  }

  function hourGridPrice(h = hour) {
    return withGrid ? gridPrice(h) : 0
  }

  function priceWithGrid(i: number) {
    return +((price(i) + hourGridPrice(Math.floor(i / 4))).toFixed(1))
  }

  function nextDay(n: number) {
    const days = Object.keys(dayPrices)
    const i = days.indexOf(graphDay)
    return i >= 0 && days[i + n] || graphDay
  }

  function toCET(d: Date) {
    return new Date(d.toLocaleString('en-US', { timeZone: 'Europe/Stockholm' }))
  }

  function dayOfWeekNumber(date: string) {
    return toCET(new Date(date)).getDay()
  }

  function dayOfWeek(date: string) {
    return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][dayOfWeekNumber(date)]
  }
</script>

{#if dayPrices && country}
  <h2>
    NordPool
    <CountrySelect bind:country/>
  </h2>
  <p class="muted">
    {day} {toLocalHour(hour, hourDiff)}-{toLocalHour(hour + 1, hourDiff)}
    <label><input type="checkbox" bind:checked={withTax}> With Tax</label>
    <label><input type="checkbox" bind:checked={withGrid}> With Grid</label>
  </p>

  <div class="row">
    <PriceCard price={priceWithGrid(index - 1)} trend={0} class="prev"/>
    <PriceCard price={priceWithGrid(index)} trend={price(index + 1) - price()}/>
    <PriceCard price={priceWithGrid(index + 1)} trend={0} class="next"/>
  </div>

  <PriceGraph prices={dayPrices[graphDay]} dayOfWeek={dayOfWeekNumber(graphDay)} hour={graphDay === day ? hour : -1}
              {hourDiff} bind:selectedHour={calcHour}
              {withTax} {withGrid}
  />
  <button on:click={() => graphDay = nextDay(-1)}>&laquo;</button>
  <select bind:value={graphDay} style="margin-top: 1.5em">
    {#each Object.keys(dayPrices) as d}
      <option value={d}>{d} {dayOfWeek(d)}</option>
    {/each}
  </select>
  <button on:click={() => graphDay = nextDay(1)}>&raquo;</button>

  <CostCalculator prices={dayPrices[graphDay]?.concat(dayPrices[nextDay(-1)] || []) || []}
                  startHour={calcHour} hourDiff={hourDiff} dayOfWeek={dayOfWeekNumber(graphDay)}
                  style="margin-top: 1.5em"/>
{/if}

<style>
  .row {
    display: flex;
    justify-content: center;
    width: 100%;
    overflow-x: hidden;
    padding: 0.5em 0;
  }

  .row :global(.prev), .row :global(.next) {
    opacity: 0.3;
  }

  button, select {
    padding: 0.5rem 1rem;
  }
</style>
