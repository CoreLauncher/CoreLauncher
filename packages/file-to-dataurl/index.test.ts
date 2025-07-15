import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { dataToDataURL, fileToDataURL } from ".";

describe("file-to-dataurl", () => {
	it("should convert data to data URL", () => {
		const data = "test";
		const dataURL = dataToDataURL(data, "text/plain");
		expect(dataURL).toBe("data:text/plain;base64,dGVzdA==");
	});

	it("should handle empty data", () => {
		const data = "";
		const dataURL = dataToDataURL(data, "text/plain");
		expect(dataURL).toBe("data:text/plain;base64,");
	});

	it("should handle different MIME types", () => {
		const data = "test";
		const dataURL = dataToDataURL(data, "application/json");
		expect(dataURL).toBe("data:application/json;base64,dGVzdA==");
	});

	it("should convert file content to data URL", () => {
		const path = join(__dirname, "test.txt");
		const dataURL = fileToDataURL(path);
		expect(dataURL).toBe("data:text/plain;base64,dGVzdA==");
	});
});
