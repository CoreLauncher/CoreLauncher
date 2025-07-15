import { use } from "react";
import { fetchAccountProviders } from "../functions/api";

const providers = fetchAccountProviders();

export default function useAccountProviders() {
	return use(providers);
}
