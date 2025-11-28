<script lang="ts">
  import PriceCard from './PriceCard.svelte'
  import PriceGraph from './PriceGraph.svelte'
  import CountrySelect from './CountrySelect.svelte'
  import CostCalculator from './CostCalculator.svelte'
  import Config, {pricesPerDay, pricesPerHour} from './Config.ts'
  import {dayOfWeekNumber, formattedPrice, nextDay, toCET} from './utils.ts'
  import DateSelector from './DateSelector.svelte'

  let config = new Config()

  const cetDate = toCET(new Date())

  let dayPrices: Record<string, number[]> = {}
  let date = cetDate.toLocaleDateString('lt')
  let hour = cetDate.getHours()
  let index = hour * pricesPerHour + Math.floor(cetDate.getMinutes() / (60 / pricesPerHour))

  $: dayOfWeek = dayOfWeekNumber(date)

  async function loadPrices() {
    dayPrices = await fetch(`/api/prices?country=${config.country}`).then(res => res.json())
  }

  $: if (config.country) changeCountry()

  function changeCountry() {
    config.save()
    loadPrices()
  }

  function price(dayPrices: Record<string, number[]>, i: number) {
    let d = date
    if (i > pricesPerDay - 1) {
      d = Object.keys(dayPrices)[0]
      i -= pricesPerDay
    } else if (i < 0) {
      d = Object.keys(dayPrices)[1]
      i += pricesPerDay
    }
    const h = Math.floor(i / pricesPerHour)
    return config.toFullPrice(dayPrices[d]?.[i] || 0, h, dayOfWeekNumber(d))
  }
</script>

<h2>
  NordPool
  <CountrySelect bind:country={config.country}/>
</h2>
<p class="muted">
  {date} {config.toLocalHour(hour)}-{config.toLocalHour(hour + 1)}
  <label><input type="checkbox" bind:checked={config.withTax}> With Tax</label>
  <label><input type="checkbox" bind:checked={config.withGrid}> With Grid</label>
</p>

<div class="row">
  <PriceCard price={formattedPrice(price(dayPrices, index - 1))} trend={0} class="prev"/>
  <PriceCard price={formattedPrice(price(dayPrices, index))} trend={price(dayPrices, index + 1) - price(dayPrices, index)}/>
  <PriceCard price={formattedPrice(price(dayPrices, index + 1))} trend={0} class="next"/>
</div>

<PriceGraph {config} prices={dayPrices[date] ?? Array(pricesPerDay).fill(0)} {dayOfWeek} bind:hour/>

<DateSelector bind:date {dayPrices}/>

<CostCalculator {config} prices={dayPrices[date]?.concat(dayPrices[nextDay(dayPrices, date, -1)] || []) || []}
                startHour={hour} dayOfWeek={dayOfWeekNumber(date)}
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

  :global(button, select) {
    padding: 0.5rem 1rem;
  }
</style>
