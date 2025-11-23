import "./LibraryPage.css";
import { useState } from "react";
import LibraryList from "../../components/Sections/LibraryList/LibraryList";
import LibraryOverview from "../../components/Sections/LibraryOverview/LibraryOverview";
import GameView from "./subcompontents/GameView/GameView";

export default function LibraryPage({
	isVisible = true,
}: {
	isVisible?: boolean;
}) {
	const [selected, setSelected] = useState<string | null>(null);
	if (!isVisible) return null;

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
