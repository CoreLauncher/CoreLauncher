import { Button, Dialog, TextInput } from "@corelauncher/react";
import "./CreateInstanceDialog.css";
import { getDefaults, getRequired, type Option } from "@corelauncher/sdk";
import { useEffect, useState } from "react";
import { PlusSquareFill } from "react-bootstrap-icons";
import {
	type GameInstanceCreateOptionsResponseMessage,
	type Message,
	MessageType,
} from "../../../types/messages";
import Socket from "../../classes/Socket";
import { OptionRenderer } from "../../components/Molecules/OptionRenderer/OptionRenderer";
import { useGameStore } from "../../stores/GameStore";

export default function CreateInstanceDialog({
	gameId,
	onClose,
}: {
	gameId: string;
	onClose: () => void;
}) {
	const [name, setName] = useState("");
	const [options, setOptions] = useState<Option[]>([]);
	const [values, setValues] = useState<
		Record<string, string | number | boolean>
	>({});
	const [requiredFilled, setRequiredFilled] = useState<boolean>(false);
	const [defaultsSet, setDefaultsSet] = useState(false);

	const game = useGameStore((store) => store.getGame(gameId));
	if (!game) throw new Error("Game not found");

	useEffect(() => {
		Socket.instance.send(MessageType.GameInstanceCreateOptionsRequest, {
			id: game.id,
			options: values,
		});
	}, [game, values]);

	useEffect(() => {
		function onMessage(type: MessageType, message: Message) {
			if (type !== MessageType.GameInstanceCreateOptionsResponse) return;
			const data = message as GameInstanceCreateOptionsResponseMessage;
			if (data.id !== game?.id) return;

			const options = data.options;

			if (!defaultsSet) {
				const defaults = getDefaults(options);
				setValues((values) => ({
					...defaults,
					...values,
				}));
				setDefaultsSet(true);
			}

			setOptions(options);
		}

		Socket.instance.on("message", onMessage);
		return () => {
			Socket.instance.off("message", onMessage);
		};
	}, [game, defaultsSet]);

	useEffect(() => {
		const required = getRequired(options);
		for (const key of required) {
			if (values[key] === "" || values[key] === undefined) {
				setRequiredFilled(false);
				return;
			}
		}

		setRequiredFilled(true);
	}, [options, values]);

	function onChange(id: string, value: string | number | boolean) {
		console.log(id, value);
		setValues((v) => ({ ...v, [id]: value }));
	}

	function onCreate() {
		console.log("cretea", name, values);
		onClose();
	}

	return (
		<Dialog
			title={`Create ${game.name} instance`}
			icon={PlusSquareFill}
			height={600}
			width={500}
			onClose={onClose}
		>
			<div className="CreateInstanceDialog">
				<TextInput
					label="Instance Name"
					required
					onChange={(value) => setName(value)}
				/>
				{options.map((option, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Its the best we have here
					<OptionRenderer key={index} option={option} onChange={onChange} />
				))}
				<hr style={{ marginTop: "auto" }} />
				<Button
					style={"success"}
					disabled={!requiredFilled || name === ""}
					onClick={onCreate}
				>
					{" "}
					Create Instance{" "}
				</Button>
			</div>
		</Dialog>
	);
}
