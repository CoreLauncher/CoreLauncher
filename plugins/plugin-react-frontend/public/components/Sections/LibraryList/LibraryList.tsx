import { useEffect, useRef, useState } from "react";
import "./LibraryList.css";
import { Button, TextInput } from "@corelauncher/react";
import { GameState } from "@corelauncher/sdk";
import clsx from "clsx";
import { Question, ViewList } from "react-bootstrap-icons";
import type { GamesUpdatedMessage } from "../../../../types/messages";
import { useGameStore } from "../../../stores/GameStore";
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
	const games = useGameStore((state) => state.games);
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

	function onQuery(value: string) {
		setQuery(value);
	}

	return (
		<div className="LibraryList" ref={divRef}>
			<div className="search">
				<Button className="home" onClick={onHome}>
					<ViewList />
				</Button>
				<TextInput
					className="search-input"
					placeholder="Search..."
					onChange={onQuery}
				/>
			</div>
			<VerticalList
				className="games"
				gap={0}
				items={games
					.toSorted((a, b) => {
						const isPriority = (game: GamesUpdatedMessage["games"][0]) =>
							[
								GameState.Installed,
								GameState.Running,
								GameState.UpdateAvailable,
								GameState.Updating,
							].includes(game.state);

						const aPriority = isPriority(a) ? 0 : 1;
						const bPriority = isPriority(b) ? 0 : 1;
						if (aPriority !== bPriority) return aPriority - bPriority;
						return a.name.localeCompare(b.name);
					})
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
						className={clsx("game", {
							selected: game.id === selected,
							running: game.state === GameState.Running,
							installed: game.state === GameState.Installed,
							"not-installed": game.state === GameState.NotInstalled,
							updating: game.state === GameState.Updating,
							"update-available": game.state === GameState.UpdateAvailable,
							unknown: game.state === GameState.Unknown,
						})}
					>
						{game.iconUrl ? (
							<img className="game-icon" src={game.iconUrl} aria-hidden />
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
