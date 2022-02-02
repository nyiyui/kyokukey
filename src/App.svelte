<script lang="ts">
  import "./base.scss";
  import { v4 as uuidv4 } from "uuid";
  import { phrases } from "./hardcoded";
  import diff_match_path from "diff-match-patch";
  import Data from "./Data.svelte";

  let text: string = "";
  let textarea: HTMLTextAreaElement;
  let result: HTMLDivElement;
  let targetIndex = 0;
  let target = phrases[0].toLowerCase();
  let errCount = 0;
  let currentUUID: string = uuidv4();
  let sessionName: string = "";

  $: target = phrases[targetIndex].toLowerCase();

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
    errCount = 0;
  }
</script>

<svelte:head>
  <title>Kyokukey Test</title>
  <meta name="robots" content="noindex, nofollow" />
  <link rel="preload" href="favicon.svg" as="image" />
  <link rel="icon" href="favicon.svg" />
  <html lang="en" />
</svelte:head>

<main>
  <h1 style="font-size: 1.5em;">
    <img src="favicon.svg" alt="Icon" height="30px" />
    Kyokukey Test
  </h1>
  <div class="w3-container">
    <div class="w3-half">
      <section>
      <h2>Input</h2>
        <textarea bind:this={textarea} bind:value={text} />
        <div id="result" bind:this={result} />
      </section>
      <section>
        <h2>Settings</h2>
        <input type="button" value="Reset" on:click={reset} />
        <label for="target">Phrase Number:</label>
        <input type="number" id="target" bind:value={targetIndex} />
        <label for="session-name">Session Name:</label>
        <input type="text" id="session-name" bind:value={sessionName} />
      </section>
    </div>
    <div class="w3-half">
      <Data
        bind:first
        bind:lastChange
        bind:elapsed
        bind:text
        bind:target
        bind:targetIndex
        bind:errCount
        bind:currentUUID
        bind:sessionName
      />
    </div>
    <a href="https://docs.google.com/forms/d/e/1FAIpQLSdxM1Y2qVInIEgs7LdQPoBoxOA2W2NU70DtKwYAa9fRMLmdvw/viewform">Survey</a>
  </div>
</main>
