#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { ShellStep } from 'aws-cdk-lib/pipelines';
import { GitHubWorkflow, AwsCredentials, JsonPatch } from 'cdk-pipelines-github';
import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { writeFileSync } from 'fs';
import * as path from "path"
import { QuoteMGAStack } from '../lib/quote-mga-stack';
import { ACMStack } from '../lib/acm-stack';

const app = new cdk.App();

// TODO: Use this to get the deployment role right
/*
new MyGitHubActionRole(app, 'MyGitHubActionRole', {
  env: { account: "284875872477", region: "eu-central-1" },
});
*/

class MyApplication extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new QuoteMGAStack(this, `QuoteMGA`, {});

    new ACMStack(this, `ACM`, {})
  }
}

const pipeline = new GitHubWorkflow(app, 'Pipeline', {
  preBuildSteps: [
    {
      "uses": "pnpm/action-setup@v2.2.4",
      with: {
        version: "8.2.0"
      }
    },
    {
      name: "Setup Gradle",
      uses: 'gradle/gradle-build-action@v2'
    },
    {
      name: "Setup Node.js environment",
      uses: "actions/setup-node@v3",
      with: {
        "node-version": 18,
        "cache": 'pnpm'
      }
    }
  ],
  synth: new ShellStep('Build', {
    commands: [
      `node ${path.relative(path.resolve(__dirname, '../../../'),path.resolve('configure-for-ci.js'))}`,
      'pnpm install',
      'pnpm build',
      // Move cdk.out to root
      `mv ${path.relative(path.resolve(__dirname, '../../../'),path.resolve('cdk.out'))} cdk.out`
    ],
  }),
  awsCreds: AwsCredentials.fromOpenIdConnect({
    // TODO: Change to respective target account
    gitHubActionRoleArn: 'arn:aws:iam::284875872477:role/GitHubActionRole',
  }),
});

// Build the stages
// TODO: Change to respective target account
const betaStage = new MyApplication(app, 'BetaStage', {env: { account: "284875872477", region: "eu-central-1" }});

// Add the stages for sequential build - earlier stages failing will stop later ones:
pipeline.addStage(betaStage, {});

app.synth();

const deployWorkflow = pipeline.workflowFile;
deployWorkflow.patch(JsonPatch.add('/on/workflow_call', {}));
deployWorkflow.patch(JsonPatch.add('/on/push/branches', ["main", "contract_flow"]));
const yaml = deployWorkflow.toYaml()
writeFileSync("../../.github/workflows/aws.yml", yaml)

