#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { InfraUsers } from '../lib/infrausers';
import { ItalyUsers } from '../lib/italyusers';
import { SpainUsers } from '../lib/spainusers';

const app = new cdk.App();
/*
new InfraUsers(app, 'InfraUsers', {
  env: { account: "284875872477", region: "eu-central-1" },
});*/

new ItalyUsers(app, 'ItalyUsers', {
  env: { account: "789716828779", region: "eu-central-1" },
});

/*
new SpainUsers(app, 'SpainUsers', {
  env: { account: "498760005782", region: "eu-central-1" },
});
*/