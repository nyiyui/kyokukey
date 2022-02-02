<script lang="ts">
  export let first: boolean;
  export let start: number;
  export let lastChange: number;
  export let elapsed: number;
  export let text: string;
  export let target: string;
  export let targetIndex: number;
  export let errCount: number;
  export let currentUUID: string;
  export let sessionName: string;
  let data = {
    first,
    start,
    lastChange,
    elapsed,
    text,
    target,
    targetIndex,
    errCount,
    currentUUID,
    sessionName,
  };

  let sent = false;

  async function send() {
    const name = `${data.currentUUID}_${data.targetIndex}`;
    let res = await fetch(`https://kiki.nyiyui.ca/submit.php?name=${name}`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      console.error(res.status);
    }
    sent = true;
  }

  $: {
    if (text === target || text.length === target.length) {
      send();
    }
  }
</script>

<section>
  <h2>Data</h2>
  <input type="button" value="Send" on:click={send} />
  {#if sent}
  <span role="status" class="sent-status sent">Sent</span>
  {:else}
  <span role="status" class="sent-status">Not Sent</span>
  {/if}
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
    <code>{JSON.stringify(data, null, 2)}</code>
  </p>
</section>
