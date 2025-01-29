import { useEffect, useRef, useState } from "react";
import "./App.css";

import Latex from "react-latex";
import ollama from 'ollama/browser'

type Role = "user" | "assistant";
type MessageType = {
	role: Role;
	content: string;
}

type PartialMessageType = {
	role: Role;
	content: string;
}

function App(props: { models: string[] }) {
	const [selectedModel, setSelectedModel] = useState(props.models[0]);
	const [canSubmitDisabled, setCanSubmitDisabled] = useState(false);
	const [prompt, setPrompt] = useState("");

	const [conversation, setConversation] = useState<MessageType[]>([]);
	const [activeMessage, setActiveMessage] = useState<PartialMessageType | null>(null);

	async function ask() {
		setCanSubmitDisabled(true);

		const message: MessageType = { role: 'user', content: prompt }
		setConversation([...conversation, message]);

		const response = await ollama.chat(
			{ model: selectedModel, messages: [message], stream: true }
		);

		const partial: PartialMessageType = {
			role: "assistant",
			content: "",
		}
		setActiveMessage(partial);

		for await (const part of response) {
			partial.content += part.message.content;
			setActiveMessage({ ...partial });
		}
		setConversation([...conversation, message, partial]);
		setActiveMessage(null);

		setCanSubmitDisabled(false);
	}

	const listRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		let current = listRef.current;
		if (!current) return;
		current.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [activeMessage, conversation]);

	return (
		<main className="w-screen h-screen flex flex-col items-center justify-center gap-4 bg-sky-200 font-medium p-4">
			<span className="text-4xl">Some AI App</span>
			<select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
				{props.models.map(model => <option key={model} value={model}>{model}</option>)}
			</select>

			<div className="w-full h-full border-2 resize-none rounded bg-sky-300 p-0.5 flex flex-col gap-2 overflow-y-auto" ref={listRef}>
				{conversation.map((message, index) => <Message key={index} message={message} />)}
				{activeMessage && <Message message={activeMessage} />}
			</div>

			<div className="w-full flex justify-between items-center gap-4">
				<input className="w-full outline-none border-2 indent-1 rounded py-1" type="text" placeholder="prompt..." onChange={(v) => { setPrompt(v.target.value) }} />
				<input className="py-1 px-6 bg-sky-400 rounded cursor-pointer border-2 text-xl disabled:bg-slate-400" type="button" value="Ask" disabled={canSubmitDisabled} onClick={ask} />
			</div>
		</main>
	);
}

function Message(props: { message: MessageType }) {
	return (
		<div className="w-full flex justify-between gap-1">
			{props.message.role === "assistant" && (
				<div className="h-9 py-1 px-2 bg-amber-200 rounded border-2">
					<span>{props.message.role}</span>
				</div>
			)}

			<div className="w-full min-h-9 h-fit border-2 resize-none rounded bg-sky-300 flex items-center px-1">
				<span className="whitespace-pre-wrap">
					<Latex displayMode={true}>{props.message.content === "" ? "EMPTY" : props.message.content}</Latex>
				</span>
			</div>

			{props.message.role === "user" && (
				<div className="h-9 py-1 px-2 bg-amber-600 rounded border-2">
					<span>{props.message.role}</span>
				</div>
			)}
		</div>
	);
}

export default App;