<script lang="ts">
	import diff_match_path from "diff-match-patch";

	let text: string = "";
	let result: HTMLDivElement;
	let lastChangeText = "";
	let elapsedText = "";
	let wpmText = "";
	let cpmText = "";
	let errText = "";
	let target = "hello world";

	const dmp = new diff_match_path();
	let elapsed: number = Date.now();
	let lastChange: number = Date.now();
	$: {
		if (text !== undefined && result !== undefined) {
			lastChangeText = `${Date.now() - lastChange} ms`;
			elapsedText = `${Date.now() - elapsed} ms`;
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
			console.log(errCount);

			if (text.length > 0) {
				wpmText = `${Math.round(
					text.trim().split(/\s+/).length / (Date.now() - elapsed) * 1000 * 60
				)}`;
				cpmText = `${Math.round(
					text.length / (Date.now() - elapsed) * 1000 * 60
				)}`;
				errText = `${Math.round(
					errCount / text.length * 100
				)}%`;
			}
		}
	};

	function reset() {
		text = "";
		lastChange = Date.now();
		elapsed = Date.now();
	}
</script>

<svelte:head>
	<title>Kyokukey Testing</title>
	<meta name="robots" content="noindex, nofollow">
	<html lang="en" />
</svelte:head>

<main>
	<textarea bind:value={text}></textarea>
	<div id="result" bind:this={result}>
		<ins>insert</ins>
		<del>delete</del>
	</div>
	<p><span contenteditable="true" bind:textContent={lastChangeText}></span> since last change</p>
	<p><span contenteditable="true" bind:textContent={elapsedText}></span> since start</p>
	<p><span contenteditable="true" bind:textContent={cpmText}></span> characters/min</p>
	<p><span contenteditable="true" bind:textContent={wpmText}></span> words/min</p>
	<p><span contenteditable="true" bind:textContent={errText}></span> % errors</p>
	<input type="button" value="Reset" on:click={reset} />
	<aside>
		<details>
			<summary>Settings</summary>
			<label for="target">Target:</label>
			<textarea id="target" bind:value={target}></textarea>
		</details>
	</aside>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	#result > ins {
		background-color: #cfc;
	}

	#result > del {
		background-color: #fcc;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
