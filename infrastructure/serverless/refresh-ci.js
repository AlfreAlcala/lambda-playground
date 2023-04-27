const fs = require("fs/promises");
const path = require('path')
const util = require('util');
const exec = util.promisify(require('child_process').exec);



async function synthAndAdd(){
    const cdkJsonPath = path.resolve(__dirname, 'cdk.json')

    const rawFile = await fs.readFile(cdkJsonPath);
    const file = JSON.parse(rawFile.toString())
    file.app = "pnpm run cdk-app"

    await fs.writeFile(cdkJsonPath, JSON.stringify(file, null, 4))
    console.log("BUILDING CI/CD")
    const cdkCommand = 'pnpm cdk synth -q'
    const {stdout, stderr} = await exec(cdkCommand, {cwd: __dirname});
    if(!stderr.includes('Successfully synthesized')){
        console.error(`Error during ${cdkCommand}`)
        throw stderr;
    }
    console.log("Updated CI")

    const gitCommand = 'git add .github ../../.github'
    const {gitStderr} = await exec(gitCommand, {cwd: __dirname});
    if(gitStderr){
        console.error(`Error during ${gitCommand}`)
        throw gitStderr;
    }

    await fs.writeFile(cdkJsonPath, rawFile)
}

synthAndAdd().catch(console.error)




