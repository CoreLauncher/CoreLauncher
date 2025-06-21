import "./LibraryPage.css";
import GameList from "../../sections/GameList/GameList";

export default function LibraryPage() {
	return (
		<main className="LibraryPage">
			<GameList />
			<div className="overview" />
		</main>
	);
}
