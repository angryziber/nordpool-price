<script lang="ts">
  import countries from './countries'

  export let country: string
</script>

<select bind:value={country} style="font-weight: bold">
  {#each Object.keys(countries) as code}
    <option>{code}</option>
  {/each}
</select>
