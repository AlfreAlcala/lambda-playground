# Welcome to the contracts lambda functions

Here is the place for the developers to write their code, the business logic.

This folder is expected to house all the lambda functions regarding contracts.

## HOWTO: Set up your programatic environment

Install the AWS CLI according to your operating system

https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

Configure your credentials

Download & delete your access credentials from AWS Secrets Manager: https://eu-central-1.console.aws.amazon.com/secretsmanager/listsecrets?region=eu-central-1

Set up your environment

```shell
aws configure
```

And fill in the information from the console

```shell
AWS Access Key ID [None]: <type key ID here>
AWS Secret Access Key [None]: <type access key>
Default region name [None]: <`eu-central-1`> Please make sure to set the region name to eu-central-1, because We will implement this infrastructure entirely in the AWS region `eu-central-1`.
Default output format [None]: <leave blank>
```

## Folder structure

* [common/](./contracts/common) (This folder is expected to house all common lambda functions regarding contracts)
  * [application-underwriting/](./contracts/common/application-underwriting)
  * [authorize-payment/](./contracts/common/authorize-payment)
  * [collect-consents/](./contracts/common/collect-consents)
  * [create-portal-acc/](./contracts/common/create-portal-acc)
  * [initiate-contract/](./contracts/common/initiate-contract)
  * [issue-policy/](./contracts/common/issue-policy)
  * [store-documents/](./contracts/common/store-documents)
  * [submit-application/](./contracts/common/submit-application)
  * [trigger-voice-of-customer/](./contracts/common/trigger-voice-of-customer)
* [README.md](./contracts/README.md)


## Useful commands

* `pnpm cdk bootstrap aws://ACCOUNT-NUMBER/eu-central-1`   bootstrap the cdk in your AWS Account. Replace ACCOUNT-NUMBER with your account number.
* `pnpm run build`   compile typescript to js
* `pnpm run watch`   watch for changes and compile
* `pnpm run test`    perform the jest unit tests
* `pnpm cdk deploy`  deploy this stack to your default AWS account/region
* `pnpm cdk diff`    compare deployed stack with current state
* `pnpm cdk synth`   emits the synthesized CloudFormation template
* `pnpm cdk-app`     runs infrastructure.ts (through ts-node, so no build necessary)

## Initial stepfunction

The initial Step Functions workflow and corresponding infrastructure is depicted here:
![./diagrams/quote.png](../infrastructure/quote-mga/diagrams/quote.png)

Some key bullet points for implementing this:
* We will implement this infrastructure entirely in the AWS region `eu-central-1`.
* We assume for now, that all lambdas will be written in Typescript and built out of this monorepo.
* We use DynamoDB to store the quote data (data model to follow)
* We use a Step Functions Express Workflow
* On success, we want to generate an event in Event Bridge