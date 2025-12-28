const packageJSONFile = Bun.file("./package.json");
const version = process.argv[2]!;
const packageJSON = await packageJSONFile.json();
console.log(version, packageJSON);

packageJSON.version = version.startsWith("v") ? version.slice(1) : version;

Bun.write(packageJSONFile, `${JSON.stringify(packageJSON, null, 2)}\n`);
