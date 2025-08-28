import { useEffect, useRef, useState } from "react";
import "./GameList.css";
import { Input } from "@corelauncher/react";
import useGames from "../../../../../hooks/useGames";

export default function GameList({
	selected,
	onSelect,
}: {
	selected?: string;
	onSelect?: (id: string) => void;
}) {
	const [query, setQuery] = useState("");
	const games = useGames();
	const divRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let isDragging = false;

		function onMouseDown(event: MouseEvent) {
			const target = event.target as HTMLElement;
			const div = divRef.current;
			if (!div) return;
			if (target !== divRef.current) return;

			const rect = div.getBoundingClientRect();
			const mouseX = event.clientX;
			const mouseY = event.clientY;
			const rectRight = rect.right;
			const rectTop = rect.top;
			const rectBottom = rect.bottom;
			if (
				mouseX >= rectRight &&
				mouseX <= rectRight + 5 &&
				mouseY >= rectTop &&
				mouseY <= rectBottom
			) {
				isDragging = true;
			}
		}

		function onMouseUp() {
			isDragging = false;
		}

		function onMove(event: MouseEvent) {
			const div = divRef.current;
			if (!div) return;
			if (!isDragging) return;
			const rect = div.getBoundingClientRect();
			div.style.width = `${event.clientX - rect.left}px`;
		}

		window.addEventListener("mousedown", onMouseDown);
		window.addEventListener("mouseup", onMouseUp);
		window.addEventListener("mousemove", onMove);
		return () => {
			window.removeEventListener("mousedown", onMouseDown);
			window.removeEventListener("mouseup", onMouseUp);
			window.removeEventListener("mousemove", onMove);
		};
	}, []);

	function onQuery(event: React.ChangeEvent<HTMLInputElement>) {
		setQuery(event.target.value);
	}

	return (
		<div className="GameList" ref={divRef}>
			<Input type="text" placeholder="Search..." onChange={onQuery} />
			<div className="games">
				{games
					.sort((a, b) => a.name.localeCompare(b.name))
					.filter(
						(game) =>
							game.name.toLowerCase().includes(query.toLowerCase()) ||
							game.id.toLowerCase().includes(query.toLowerCase()),
					)
					.map((game) => (
						<button
							key={game.id}
							type="button"
							onClick={() => onSelect?.(game.id)}
							className={`game ${game.id === selected ? "selected" : ""}`}
						>
							<p>{game.name}</p>
						</button>
					))}
			</div>
		</div>
	);
}
