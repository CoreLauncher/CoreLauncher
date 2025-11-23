import clsx from "clsx";
import "./VerticalList.css";

export default function VerticalList<Item>({
	items,
	element,
	gap = 8,
	className,
}: {
	items: Item[];
	element: (item: Item, index: number, count: number) => React.ReactNode;
	gap?: number | string;
	className?: string;
}) {
	return (
		<div
			className={clsx("VerticalList", className)}
			style={{
				rowGap: gap,
			}}
		>
			{items.map((item, index) => element(item, index, items.length))}
		</div>
	);
}
