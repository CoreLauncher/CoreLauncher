import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import App from "./app/app";

const element = document.getElementById("root")!;
const app = (
	<StrictMode>
		<App />
	</StrictMode>
);

if (import.meta.hot) {
	if (!import.meta.hot.data.root)
		import.meta.hot.data.root = createRoot(element);
	const root = import.meta.hot.data.root as Root;
	root.render(app);
} else {
	createRoot(element).render(app);
}
