const packageJSONFile = Bun.file("./package.json");
const version = process.argv[2];
const packageJSON = await packageJSONFile.json();
console.log(version, packageJSON);

packageJSON.version = version;

Bun.write(packageJSONFile, `${JSON.stringify(packageJSON, null, 2)}\n`);
