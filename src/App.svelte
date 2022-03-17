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

  $: {
    if (targetIndex == -1) {
      target = "hi";
    } else {
      target = phrases[targetIndex].toLowerCase();
    }
  }

  let hintFrame: HTMLIFrameElement;
  const dmp = new diff_match_path();
  const now = Date.now();
  let lastReset = now;
  let firstChange = now;
  let lastChange = now;
  let first: boolean = true;
  let nextKey: string;
  $: {
    if (text !== undefined && result !== undefined) {
      if (first && text.length !== 0) {
        firstChange = Date.now();
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
        if (part[0] === 1) {
          nextKey = part[1].charAt(0);
        }
        result.appendChild(elem);
      });
      if (nextKey === ' ') nextKey = 'SPACE';
      if (nextKey === '\n') nextKey = 'ENTER';
      if (nextKey === '.') nextKey = 'PERIOD';
      hintFrame.src = `/render.html#key-${nextKey.toUpperCase()}`;
      //hintFrame.src = `https://nyiyui.ca/render#key-${nextKey.toUpperCase()}`;
    }
  }

  function reset() {
    text = "";
    textarea.focus();
    lastReset = Date.now();
    lastChange = Date.now();
    firstChange = Date.now();
    first = true;
    errCount = 0;
    currentUUID = uuidv4();
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
    <section>
      <h2>Input</h2>
      <textarea id="input" bind:this={textarea} bind:value={text} />
      <div id="result" bind:this={result} />
    </section>
    <section>
      <h2>Hint</h2>
      Next key: {nextKey}
      <iframe title="hint" bind:this={hintFrame} />
    </section>
    <div class="w3-half">
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
        bind:lastReset
        bind:lastChange
        bind:firstChange
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
