#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Tags } from 'aws-cdk-lib';
import * as iam from "aws-cdk-lib/aws-iam";
import 'source-map-support/register';
import { ACMStack } from '../lib/acm-stack';
import { QuoteMGAStack } from '../lib/quote-mga-stack';

const app = new cdk.App();

const username = (process.env.USER?.replace(/[^0-9a-zA-Z]/gi, ''))?.substring(0,10)

const quoteMGAStack = new QuoteMGAStack(app, `QuoteMGA-${username}`, {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "eu-central-1" },
});

const acmStack = new ACMStack(app, `ACM-${username}`, {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "eu-central-1" },
})