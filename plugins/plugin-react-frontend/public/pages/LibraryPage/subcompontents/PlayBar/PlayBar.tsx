import { type Icon, PlayFill } from "react-bootstrap-icons";
import "./PlayBar.css";
import { MessageType } from "../../../../../types/messages";
import Socket from "../../../../classes/Socket";

export default function PlayBar({
	meta = [],
	game,
}: {
	meta?: { icon: Icon; title: string; content: string }[];
	game: string;
}) {
	function onPlay() {
		Socket.instance.send(MessageType.LaunchGame, {
			id: game,
		});
	}

	return (
		<div className="PlayBar">
			<button className="playbutton" type="button" onClick={onPlay}>
				<PlayFill size={"90%"} />
			</button>
			<div className="metadata">
				{meta.map((item) => (
					<div key={item.title} className="metadata-item">
						<item.icon />
						<div>
							<p className="title">{item.title}</p>
							<p className="content">{item.content}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
