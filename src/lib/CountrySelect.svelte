<script lang="ts">
  import countries from './countries'

  export let country: keyof typeof countries
</script>

<select bind:value={country} style="font-weight: bold">
  {#each Object.keys(countries) as code}
    <option>{code}</option>
  {/each}
</select>
