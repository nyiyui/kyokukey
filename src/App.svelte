<script lang="ts">
  import "./base.scss";
  import { v4 as uuidv4 } from "uuid";
  import diff_match_path from "diff-match-patch";
  import Serial from "./Serial.svelte";

  let text: string = "";
  let textarea: HTMLTextAreaElement;
  let result: HTMLDivElement;
  let target = "hello world";
  let errCount = 0;
  const currentUUID = uuidv4();

  const dmp = new diff_match_path();
  let elapsed: number = Date.now();
  let lastChange: number = Date.now();
  let first: boolean = true;
  $: {
    if (text !== undefined && result !== undefined) {
      if (first && text.length !== 0) {
        elapsed = Date.now();
        first = false;
      }
      lastChange = Date.now();

      errCount = 0;
      result.textContent = "";
      dmp.diff_main(text, target).forEach((part: [number, string]) => {
        const elem = document.createElement(
          part[0] === -1 ? "del" : part[0] == 1 ? "ins" : "span"
        );
        elem.textContent = part[1];
        if (part[0] === -1) {
	console.log(part);
          errCount += part[1].length;
        }
        result.appendChild(elem);
      });
    }
  }

  function reset() {
    text = "";
    textarea.focus();
    lastChange = Date.now();
    elapsed = Date.now();
    first = true;
  }
</script>

<svelte:head>
  <title>Kyokukey Testing</title>
  <meta name="robots" content="noindex, nofollow" />
  <html lang="en" />
</svelte:head>

<main>
  <textarea bind:this={textarea} bind:value={text} />
  <div id="result" bind:this={result} />
  <aside>
    <p>Session ID: {currentUUID}</p>
    First: {first}
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
  </aside>
  <input type="button" value="Reset" on:click={reset} />
  <aside>
    <details>
      <summary>Settings</summary>
      <label for="target">Target:</label>
      <textarea id="target" bind:value={target} />
    </details>
  </aside>
  {#if 'serial' in navigator}
    <Serial />
  {/if}
</main>
