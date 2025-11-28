<script lang="ts">
  import PriceCard from './PriceCard.svelte'
  import PriceGraph from './PriceGraph.svelte'
  import CountrySelect from './CountrySelect.svelte'
  import CostCalculator from './CostCalculator.svelte'
  import Config from './Config.ts'

  let config = new Config()

  const cetDate = toCET(new Date())

  let dayPrices: Record<string, number[]> = {}
  let day = cetDate.toLocaleDateString('lt')
  let graphDay = day
  let hour = cetDate.getHours()
  let calcHour = hour
  let index = hour * 4 + Math.floor(cetDate.getMinutes() / 15)

  $: prices = dayPrices[day] || Array(96).fill(0)
  $: dayOfWeek = dayOfWeekNumber(day)

  async function loadPrices() {
    dayPrices = await fetch(`/api/prices?country=${config.country}`).then(res => res.json())
  }

  $: if (config.country) changeCountry()

  function changeCountry() {
    config.save()
    loadPrices()
  }

  function price(i = index) {
    let d = day
    if (i > prices.length - 1) {
      d = Object.keys(dayPrices)[0]
      i -= prices.length
    } else if (i < 0) {
      d = Object.keys(dayPrices)[1]
      i += prices.length
    }
    const h = Math.floor(i / 4)
    return config.toFullPrice(dayPrices[d]?.[i] || 0, h, dayOfWeekNumber(d))
  }

  function formattedPrice(i: number) {
    return +price(i).toFixed(1)
  }

  function nextDay(n: number) {
    const days = Object.keys(dayPrices)
    const i = days.indexOf(graphDay)
    return i >= 0 && days[i + n] || graphDay
  }

  function dayOfWeekNumber(date: string) {
    return toCET(new Date(date)).getDay()
  }

  function dayOfWeekName(date: string) {
    return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][dayOfWeekNumber(date)]
  }

  function toCET(d: Date) {
    return new Date(d.toLocaleString('en-US', { timeZone: 'Europe/Stockholm' }))
  }
</script>

<h2>
  NordPool
  <CountrySelect bind:country={config.country}/>
</h2>
<p class="muted">
  {day} {config.toLocalHour(hour)}-{config.toLocalHour(hour + 1)}
  <label><input type="checkbox" bind:checked={config.withTax}> With Tax</label>
  <label><input type="checkbox" bind:checked={config.withGrid}> With Grid</label>
</p>

<div class="row">
  <PriceCard price={formattedPrice(index - 1)} trend={0} class="prev"/>
  <PriceCard price={formattedPrice(index)} trend={price(index + 1) - price()}/>
  <PriceCard price={formattedPrice(index + 1)} trend={0} class="next"/>
</div>

<PriceGraph {config} prices={dayPrices[graphDay]}
            {dayOfWeek} hour={graphDay === day ? hour : -1}
            bind:selectedHour={calcHour}/>

<button on:click={() => graphDay = nextDay(-1)}>&laquo;</button>
<select bind:value={graphDay} style="margin-top: 1.5em">
  {#each Object.keys(dayPrices) as d}
    <option value={d}>{d} {dayOfWeekName(d)}</option>
  {/each}
</select>
<button on:click={() => graphDay = nextDay(1)}>&raquo;</button>

<CostCalculator {config} prices={dayPrices[graphDay]?.concat(dayPrices[nextDay(-1)] || []) || []}
                startHour={calcHour} dayOfWeek={dayOfWeekNumber(graphDay)}
                style="margin-top: 1.5em"/>

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
