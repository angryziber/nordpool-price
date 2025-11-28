<script lang="ts">
  import {dayOfWeekName, nextDay} from './utils.ts'

  export let date: string
  export let dayPrices: Record<string, number[]>
</script>

<button on:click={() => date = nextDay(dayPrices, date, -1)}>&laquo;</button>
<select bind:value={date} style="margin-top: 1.5em">
  {#each Object.keys(dayPrices) as d}
    <option value={d}>{d} {dayOfWeekName(d)}</option>
  {/each}
</select>
<button on:click={() => date = nextDay(dayPrices, date, 1)}>&raquo;</button>
