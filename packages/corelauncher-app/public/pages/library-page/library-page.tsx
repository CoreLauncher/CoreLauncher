import "./library-page.css";

import Block from "../../components/layout/block/block";

export default function LibraryPage() {
	return (
		<div className="LibraryPage">
			<Block className="library"></Block>
			<Block className="game"></Block>
		</div>
	);
}
