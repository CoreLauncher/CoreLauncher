import "./LibraryPage.css";
import { useState } from "react";
import GameList from "../../sections/GameList/GameList";

export default function LibraryPage() {
	const [selected, setSelected] = useState<string | undefined>(undefined);
	return (
		<main className="LibraryPage">
			<GameList selected={selected} onSelect={setSelected} />
			<div className="overview">{selected}</div>
		</main>
	);
}
