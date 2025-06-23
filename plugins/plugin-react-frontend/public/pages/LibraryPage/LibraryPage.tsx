import "./LibraryPage.css";
import GameList from "../../sections/GameList/GameList";
import { useState } from "react";

export default function LibraryPage() {
	const [selected, setSelected] = useState<string | undefined>(undefined);
	return (
		<main className="LibraryPage">
			<GameList selected={selected} onSelect={setSelected} />
			<div className="overview">{selected}</div>
		</main>
	);
}
