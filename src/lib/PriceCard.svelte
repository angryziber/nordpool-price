<script lang="ts">
  export let price: number
  export let trend: number
</script>

<h1 {...$$restProps}>
  {price}{#if trend > 0}<span class="up">▲</span>{:else if trend < 0}<span class="down">▼</span>{/if}
  <small>¢/kWh</small>
</h1>

<style>
  h1 {
    text-align: center;
    width: 5em;
    padding: 0.5em 0;
    margin: 0 0.3em;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
  }

  small {
    display: block;
    color: gray;
    font-size: 50%;
  }

  .up {
    color: darkred;
  }

  .down {
    color: darkgreen;
  }
</style>
