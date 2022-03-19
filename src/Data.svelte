<script lang="ts">
  export let first: boolean;
  export let lastReset: number;
  export let lastChange: number;
  export let firstChange: number;
  export let text: string;
  export let target: string;
  export let targetIndex: number;
  export let errCount: number;
  export let currentUUID: string;
  export let sessionName: string;
  let data = {
    first,
    lastReset,
    lastChange,
    firstChange,
    duration: lastChange - firstChange,
    text,
    target,
    targetIndex,
    errCount,
    currentUUID,
    sessionName,
  };
  $: data = {
    first,
    lastReset,
    start: lastReset,
    lastChange,
    elapsed: firstChange,
    firstChange,
    duration: lastChange - firstChange,
    text,
    target,
    targetIndex,
    errCount,
    currentUUID,
    sessionName,
  };

  let sentText = "";

  enum Status {
    PENDING,
    SENT,
    SENDING,
    ERROR,
  }

  let status: Status = Status.PENDING;

  async function send() {
    if (sessionName === "") {
      status = Status.ERROR;
      alert("Please enter a session name");
    }
    status = Status.SENDING;
    const controller = new AbortController();
    const timeout = 5000;
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(`https://kiki2.nyiyui.ca/w/submit.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.status !== 200 && res.status !== 0) {
        throw new Error(`${res.status} ${res.statusText} ${res.body}`);
      }
      console.log(res.status, res);
      status = Status.SENT;
      sentText = text;
      console.log(`response from submit: ${res.status} ${res.statusText} ${await res.text()}`);
    } catch (err) {
      status = Status.ERROR;
      console.log(`error while sending data to kiki: ${err}`);
    }
  }

  $: {
    if (text === target || text.length === target.length) {
      send();
    }
  }

  $: if (sentText !== text) {
    status = Status.PENDING;
  }
</script>

<section>
  <p>
    Status:
    <!-- TODO: fix this bodge soon -->
    {#if status == Status.PENDING}
    <span role="status" class="sent-status pending">waiting for results…</span>
    {:else if status == Status.SENDING}
    <span role="status" class="sent-status sending">sending…</span>
    {:else if status == Status.SENT}
    <span role="status" class="sent-status sent">sent.</span>
    {:else if status == Status.ERROR}
    <span role="status" class="sent-status error">error!</span>
    {/if}
    (or,
    <input type="button" value="manually send current data" on:click={send} />
    )
  </p>
  <p>
    Elapsed (since last key press):
    <strong class="time">
      {(lastChange - firstChange)/1000} s
    </strong>
  </p>
  <p>
    characters/min: {(text.length / (Date.now() - firstChange)) * 1000 * 60}
  </p>
  <p>
    words/min {(text.trim().split(/\s+/).length / (Date.now() - firstChange)) *
      1000 *
      60}
  </p>
  <details>
    <summary>JSON</summary>
    <code>{JSON.stringify(data, null, 2)}</code>
  </details>
</section>
