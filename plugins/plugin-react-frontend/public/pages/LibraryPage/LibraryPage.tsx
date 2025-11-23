import "./LibraryPage.css";
import { useState } from "react";
import LibraryList from "../../components/Sections/LibraryList/LibraryList";
import LibraryOverview from "../../components/Sections/LibraryOverview/LibraryOverview";
import GameView from "./subcompontents/GameView/GameView";

export default function LibraryPage() {
	const [selected, setSelected] = useState<string | null>(null);

	return (
		<main className="LibraryPage">
			<LibraryList
				selected={selected}
				onSelect={setSelected}
				onHome={() => setSelected(null)}
			/>
			{selected ? (
				<GameView gameId={selected} />
			) : (
				<LibraryOverview onSelect={setSelected} />
			)}
		</main>
	);
}
