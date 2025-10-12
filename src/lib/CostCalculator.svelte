<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { toFullKwhPrice, toGridKwhPrice, toLocalHour } from './formatters'

  export let dayOfWeek: number
  export let hourPrices: number[]
  export let startHour: number
  export let hourDiff: number

  let gridPriceDay = 0
  let gridPriceNight = 0
  let taxPercent = 0
  let comparisonPrice = 0
  let finalPrices = true
  let detailsOpen = false
  let kW: number
  let hours: number

  const predefined = [
    {name: 'Custom', kW: 1, h: 1},
    {name: 'Sauna', kW: 9, h: 3},
    {name: 'Heater', kW: 2.5, h: 8},
    {name: 'Nissan Leaf', kW: 3.3, h: 7.5},
    {name: 'Tesla Model 3', kW: 11, h: 5},
    {name: 'Tesla Model Y', kW: 11, h: 6.8},
    {name: '100W light', kW: 0.1, h: 24},
    {name: 'Reference', kW: 1, h: 1}
  ]

  let selectedPredefined = predefined[0]

  onMount(() => {
    kW = +localStorage.getItem('kW') || selectedPredefined.kW
    hours = +localStorage.getItem('hours') || selectedPredefined.h
    gridPriceDay = +localStorage.getItem('gridPriceDay') || 0
    gridPriceNight = +localStorage.getItem('gridPriceNight') || 0
    taxPercent = +localStorage.getItem('taxPercent') || 0
    comparisonPrice = +localStorage.getItem('comparisonPrice') || 0
  })

  const dispatch = createEventDispatcher()

  function calc() {
    let cents = 0
    if (!hourPrices) return 0
    for (let i = 0; i < hours; i++) {
      const p = hourPrices[(startHour + i) % hourPrices.length]
      const gridPrice = toGridKwhPrice(gridPriceDay, gridPriceNight, startHour + i, dayOfWeek, taxPercent, finalPrices, finalPrices)
      cents += kW * (toFullKwhPrice(p, taxPercent, finalPrices) + gridPrice)
    }
    return cents / 100
  }

  function onPredefinedChange(e: Event) {
    const target = e.target as HTMLSelectElement
    selectedPredefined = predefined[target.selectedIndex]
    kW = selectedPredefined.kW
    hours = selectedPredefined.h
  }

  let costElement: HTMLElement
  $: if (costElement && (kW, hours, gridPriceDay, gridPriceNight, taxPercent, comparisonPrice)) {
    costElement.classList.add('updated')
    setTimeout(() => costElement.classList.remove('updated'), 500)
    localStorage.setItem('kW', String(kW))
    localStorage.setItem('hours', String(hours))
    localStorage.setItem('gridPriceDay', String(gridPriceDay))
    localStorage.setItem('gridPriceNight', String(gridPriceNight))
    localStorage.setItem('taxPercent', String(taxPercent))
    localStorage.setItem('comparisonPrice', String(comparisonPrice))
    dispatch('changed', {gridPriceDay, gridPriceNight, taxPercent, comparisonPrice})
  }
</script>

<div {...$$restProps}>
  <select on:input={onPredefinedChange}>
    {#each predefined as p}
      <option selected={p === selectedPredefined}>{p.name}</option>
    {/each}
  </select>
  <span class="field">
    <input type="number" bind:value={kW}> kW
  </span>
  <span class="field">
    start at {toLocalHour(startHour, hourDiff)} for
    <input type="number" bind:value={hours}> h
  </span>

  = <strong class="cost" bind:this={costElement}>{calc().toFixed(2)} €</strong>

  <div style="margin-top: 1em">
    <button on:click={() => detailsOpen = !detailsOpen}>More {detailsOpen ? '▴' : '▾'}</button>
  </div>
  <div style="margin-top: 1em; display: {detailsOpen ? 'block' : 'none'}">
    <span class="field">
      Grid price day <input type="number" bind:value={gridPriceDay}> ¢/kWh
    </span>
    <span class="field">
      Grid price night <input type="number" bind:value={gridPriceNight}> ¢/kWh
    </span>
    <div style="margin-top: 0.5em"></div>
    <span class="field">
      Tax <input type="number" bind:value={taxPercent}> %
    </span>
    <span class="field">
      Comparison <input type="number" bind:value={comparisonPrice}> ¢/kWh
    </span>
  </div>
</div>

<style>
  div {
    width: 66%;
    max-width: 600px;
    margin: 0 auto;
    background: var(--mid-color);
    border: 1px solid lightgray;
    padding: 1em;
  }

  input {
    width: 4em;
  }

  .field {
    margin-left: 1em;
  }

  @media screen and (max-width: 500px) {
    .field {
      display: block;
      margin: 0.5em 0;
    }
  }

  .cost {transition: background-color 0.5s}
  .cost.updated {background-color: yellow}
</style>
