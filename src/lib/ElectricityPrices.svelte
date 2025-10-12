<script lang="ts">
  import { onMount } from 'svelte'
  import { toFullKwhPrice, toLocalHour } from './formatters'
  import countries from './countries'
  import PriceCard from './PriceCard.svelte'
  import PriceGraph from './PriceGraph.svelte'
  import CountrySelect from './CountrySelect.svelte'
  import CostCalculator from './CostCalculator.svelte'

  let country: string
  let dayPrices: Record<string, number[]> = {}
  let day: string
  let hour: number
  let index: number
  let graphDay: string
  let calcHour: number
  let gridPriceDay: number
  let gridPriceNight: number
  let taxPercent: number
  let comparisonPrice: number
  let withTax: boolean
  let withGrid: boolean
  let hourDiff: number = 1

  onMount(async () => {
    country = localStorage.getItem('country') || 'EE'
    withTax = true
    withGrid = false
    taxPercent = +localStorage.getItem('taxPercent') || 23
    gridPriceDay = +localStorage.getItem('gridPriceDay') || 7.41
    gridPriceNight = +localStorage.getItem('gridPriceNight') || 4.28
    comparisonPrice = +localStorage.getItem('comparisonPrice') || 16.03

    const cetDate = toCET(new Date())
    day = graphDay = cetDate.toLocaleDateString('lt')
    hour = calcHour = cetDate.getHours()
    index = hour * 4 + Math.floor(cetDate.getMinutes() / 15)

    await loadPrices()
  })

  async function loadPrices() {
    dayPrices = {}
    dayPrices = await fetch(`/api/prices?country=${country}`).then(res => res.json())
  }

  function hourPrice(i = index) {
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
    return toFullKwhPrice(ps[d]?.[i] || 0, taxPercent, withTax)
  }

  function gridPrice(h = hour) {
    return withGrid ? (h >= 7 && h <= 22 ? gridPriceDay : gridPriceNight) : 0
  }

  function hourPriceWithGrid(h = hour) {
    return (hourPrice(h) + gridPrice(h)).toFixed(1)
  }

  function changeCountry(newCountry: string) {
    country = newCountry
    hourDiff = countries[country].hourDiff
    loadPrices()
    localStorage.setItem('country', country)
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

  function onCostCalculatorChange(e: CustomEvent) {
    taxPercent = e.detail.taxPercent
    gridPriceDay = e.detail.gridPriceDay
    gridPriceNight = e.detail.gridPriceNight
    comparisonPrice = e.detail.comparisonPrice
  }
</script>

{#if dayPrices && country}
  <h2>
    NordPool
    <CountrySelect bind:country on:change={e => changeCountry(e.currentTarget.value)}/>
  </h2>
  <p class="muted">
    {day} {toLocalHour(hour, hourDiff)}-{toLocalHour(hour + 1, hourDiff)}
    <label><input type="checkbox" bind:checked={withTax}> With Tax</label>
    <label><input type="checkbox" bind:checked={withGrid}> With Grid</label>
  </p>

  <div class="row">
    <PriceCard price={+hourPriceWithGrid(index - 1)} trend={0} class="prev"/>
    <PriceCard price={+hourPriceWithGrid()} trend={hourPrice(index + 1) - hourPrice()}/>
    <PriceCard price={+hourPriceWithGrid(index + 1)} trend={0} class="next"/>
  </div>

  <PriceGraph prices={dayPrices[graphDay]} dayOfWeek={dayOfWeekNumber(graphDay)} hour={graphDay === day ? hour : -1}
              hourDiff={hourDiff} on:selected={(e) => calcHour = e.detail}
              taxPercent={taxPercent} withTax={withTax} comparisonPrice={comparisonPrice}
              gridPriceDay={gridPriceDay} gridPriceNight={gridPriceNight} withGrid={withGrid}
  />
  <button on:click={() => graphDay = nextDay(-1)}>&laquo;</button>
  <select bind:value={graphDay} style="margin-top: 1.5em">
    {#each Object.keys(dayPrices) as d}
      <option value={d}>{d} {dayOfWeek(d)}</option>
    {/each}
  </select>
  <button on:click={() => graphDay = nextDay(1)}>&raquo;</button>

  <CostCalculator hourPrices={dayPrices[graphDay]?.concat(dayPrices[nextDay(-1)] || []) || []}
                  startHour={calcHour} hourDiff={hourDiff} dayOfWeek={dayOfWeekNumber(graphDay)}
                  on:changed={onCostCalculatorChange}
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
