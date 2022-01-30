<script lang="ts">
  export let first: boolean;
  export let lastChange: number;
  export let elapsed: number;
  export let text: string;
  export let target: string;
  export let errCount: number;
  export let currentUUID: string;
</script>

<section>
  <h2>Data</h2>
  <p>Session ID: <code>{currentUUID}</code></p>
  <p>
    First: {first}
  </p>
  <p>
    Last change: {Date.now() - lastChange} ms
  </p>
  <p>
    Elapsed: {lastChange - elapsed} ms
  </p>
  <p>
    characters/min: {(text.length / (Date.now() - elapsed)) * 1000 * 60}
  </p>
  <p>
    words/min {(text.trim().split(/\s+/).length / (Date.now() - elapsed)) *
      1000 *
      60}
  </p>
  <p>Error rate: {(errCount / text.length) * 100}%</p>
  <p>
    Structured: 
    <code>{JSON.stringify(
      {
        first,
        lastChange,
        elapsed,
        text,
        target,
        errCount,
        currentUUID,
      },
      )}</code>
  </p>
</section>
