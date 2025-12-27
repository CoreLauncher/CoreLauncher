import "./LibraryPage.css";
import { type Ref, useImperativeHandle, useState } from "react";
import LibraryList from "../../components/Sections/LibraryList/LibraryList";
import LibraryOverview from "../../components/Sections/LibraryOverview/LibraryOverview";
import GameView from "./subcompontents/GameView/GameView";

export interface LibraryPageRefObject {
	clearSelection: () => void;
}

export default function LibraryPage({
	ref,
}: {
	ref: Ref<LibraryPageRefObject>;
}) {
	const [selected, setSelected] = useState<string | null>(null);

	useImperativeHandle(ref, () => {
		return {
			clearSelection: () => setSelected(null),
		};
	}, []);

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
