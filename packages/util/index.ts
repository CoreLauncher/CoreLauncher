/**
 * Creates an array of numbers within a specified range.
 * @param start position to start from
 * @param end position to end at
 * @param step step size (default 1)
 */
export function range(start: number, end: number, step = 1) {
	const arr = [];
	for (let i = start; i < end; i += step) arr.push(i);

	return arr;
}
