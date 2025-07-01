import "./LibraryPage.css";
import { useState } from "react";
import GameList from "./subcompontents/GameList/GameList";
import GameView from "./subcompontents/GameView/GameView";

export default function LibraryPage({
	isVisible = true,
}: {
	isVisible?: boolean;
}) {
	const [selected, setSelected] = useState<string | undefined>(undefined);

	if (!isVisible) return null;

	return (
		<main className="LibraryPage">
			<GameList selected={selected} onSelect={setSelected} />
			{selected ? <GameView gameId={selected} /> : <p>no selection</p>}
		</main>
	);
}
