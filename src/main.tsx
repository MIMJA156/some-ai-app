import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import ollama from 'ollama/browser'

(async () => {
	let models: string[] = []
	let showApp = false;
	try {
		let fullModels = await ollama.list();
		models = fullModels.models.map(m => m.name).reverse();
		showApp = true;
	} catch (e) { }

	function reload() {
		location.reload();
	}

	ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
		<React.StrictMode>
			{showApp ?
				<App models={models} /> :
				<div className="flex flex-col items-center justify-center w-screen h-screen text-2xl">
					<span>Ollama is not running. Start it and click reload.</span>
					<button className="underline text-sky-400 hover:cursor-pointer text-3xl" onClick={reload}>
						reload
					</button>
				</div>}
		</React.StrictMode>,
	);
})();