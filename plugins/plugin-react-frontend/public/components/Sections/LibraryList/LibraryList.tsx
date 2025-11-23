import { useEffect, useRef, useState } from "react";
import "./LibraryList.css";
import { Button, Input } from "@corelauncher/react";
import { Question, ViewList } from "react-bootstrap-icons";
import useGames from "../../../hooks/useGames";
import VerticalList from "../../Atoms/VerticalList/VerticalList";

export default function LibraryList({
	selected,
	onSelect,
	onHome,
}: {
	selected?: string | null;
	onSelect?: (id: string) => void;
	onHome?: () => void;
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
		<div className="LibraryList" ref={divRef}>
			<div className="search">
				<Button className="home" onClick={onHome}>
					<ViewList />
				</Button>
				<Input type="text" placeholder="Search..." onChange={onQuery} />
			</div>
			<VerticalList
				className="games"
				gap={0}
				items={games
					.sort((a, b) => a.name.localeCompare(b.name))
					.filter(
						(game) =>
							game.name.toLowerCase().includes(query.toLowerCase()) ||
							game.id.toLowerCase().includes(query.toLowerCase()),
					)}
				element={(game) => (
					<button
						key={game.id}
						type="button"
						onClick={() => onSelect?.(game.id)}
						className={`game ${game.id === selected ? "selected" : ""}`}
					>
						{game.icon ? (
							<img className="game-icon" src={game.icon} aria-hidden />
						) : (
							<div className="game-icon">
								<Question />
							</div>
						)}
						<p>{game.name}</p>
					</button>
				)}
			/>
		</div>
	);
}
