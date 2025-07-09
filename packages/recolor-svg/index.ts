export default function recolorSVG(data: string, color: string) {
	const rewriter = new HTMLRewriter().on("svg", {
		element: (element) => {
			if (element.hasAttribute("fill")) element.setAttribute("fill", color);
			if (element.hasAttribute("stroke")) element.setAttribute("stroke", color);
			if (element.hasAttribute("color")) element.setAttribute("color", color);
		},
	});

	return rewriter.transform(data);
}
