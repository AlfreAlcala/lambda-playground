const fs = require("fs");
const path = require('path')

const cdkJsonPath = path.resolve(__dirname, 'cdk.json')

const rawFile = fs.readFileSync(cdkJsonPath);
const file = JSON.parse(rawFile.toString())
file.app = "pnpm run cdk-app"

fs.writeFileSync(cdkJsonPath, JSON.stringify(file, null, 4))