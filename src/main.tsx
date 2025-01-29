import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import ollama from 'ollama/browser'

let models: string[] = []
let showApp = false;
try {
	let fullModels = await ollama.list();
	models = fullModels.models.map(m => m.name).reverse();
	showApp = true;
} catch (e) { }

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		{showApp ? <App models={models} /> : <div>Ollama is not running (reload to re-attempt connection)</div>}
	</React.StrictMode>,
);