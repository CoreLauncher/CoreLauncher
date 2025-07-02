import { use } from "react";
import { fetchApplicationVersion } from "../functions/api";

const version = fetchApplicationVersion();

export default function useApplicationVersion() {
	return use(version);
}
