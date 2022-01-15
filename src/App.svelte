<script lang="ts">
  import "./base.scss";
  import { v4 as uuidv4 } from "uuid";
  import diff_match_path from "diff-match-patch";

  let text: string = "";
  let result: HTMLDivElement;
  let target = "hello world";
  const currentUUID = uuidv4();

  const dmp = new diff_match_path();
  let elapsed: number = Date.now();
  let lastChange: number = Date.now();
  $: {
    if (text !== undefined && result !== undefined) {
      lastChange = Date.now();

      let errCount = 0;
      result.textContent = "";
      dmp.diff_main(text, target).forEach((part: [number, string]) => {
        const elem = document.createElement(
          part[0] === -1 ? "del" : part[0] == 1 ? "ins" : "span"
        );
        elem.textContent = part[1];
        if (part[0] !== 0) {
          errCount += part[1].length;
        }
        result.appendChild(elem);
      });
    }
  }

  function reset() {
    text = "";
    lastChange = Date.now();
    elapsed = Date.now();
  }
</script>

<svelte:head>
  <title>Kyokukey Testing</title>
  <meta name="robots" content="noindex, nofollow" />
  <html lang="en" />
</svelte:head>

<main>
  <textarea bind:value={text} />
  <div id="result" bind:this={result} />
  <aside>
    <p>Session ID: {currentUUID}</p>
    <p>
      Last change: {Date.now() - lastChange} ms
    </p>
    <p>
      Elapsed: {Date.now() - elapsed} ms
    </p>
    <p>
      characters/min: {(text.length / (Date.now() - elapsed)) * 1000 * 60}
    </p>
    <p>
      words/min {(text.trim().split(/\s+/).length / (Date.now() - elapsed)) *
        1000 *
        60}
    </p>
    <p>Error rate: {(text.length / (Date.now() - elapsed)) * 1000 * 60}%</p>
  </aside>
  <input type="button" value="Reset" on:click={reset} />
  <aside>
    <details>
      <summary>Settings</summary>
      <label for="target">Target:</label>
      <textarea id="target" bind:value={target} />
    </details>
  </aside>
</main>
