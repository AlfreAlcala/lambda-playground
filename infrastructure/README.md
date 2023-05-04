# Welcome to your Infrastructure

Assuming you want to start to write the cdk stepfunction and deploy it. Please make sure you already follow the instructions given in general [README](..//README.md)


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

## Useful commands

* `pnpm cdk bootstrap aws://ACCOUNT-NUMBER/eu-central-1`   bootstrap the cdk in your AWS Account. Replace ACCOUNT-NUMBER with your account number.
* `pnpm run build`     compile typescript to js
* `pnpm run watch`     watch for changes and compile
* `pnpm run test`      perform the jest unit tests
* `pnpm cdk deploy`    deploy this stack to your default AWS account/region
* `pnpm cdk destroy`   destroys one or more specified stacks
* `pnpm cdk diff`      compare deployed stack with current state
* `pnpm cdk synth`     emits the synthesized CloudFormation template
* `pnpm cdk-app`       runs infrastructure.ts (through ts-node, so no build necessary)


## Initial stepfunction

The initial Step Functions workflow and corresponding infrastructure is depicted here:
![quote.png](../infrastructure/quote-mga/diagrams/quote.png)

Some key bullet points for implementing this:
* We will implement this infrastructure entirely in the AWS region `eu-central-1`.
* We assume for now, that all lambdas will be written in Typescript and built out of this monorepo.
* We use DynamoDB to store the quote data (data model to follow)
* We use a Step Functions Express Workflow
* On success, we want to generate an event in Event Bridge


## CI/CD

This folder hosts the AWS infrastructure for spinning up the StepFunctions, Lambdas etc.

CDK allows for the infrastructure, including said pipeline, to be part of the code itself. For this project we decide to use CDK to make the pipeline that is intended to deploy the code also part of the same code.

## What is a stack? What is a construct?
A stack is unit of deployment. All resources defined within the scope of a stack are provisioned as a single unit.
Constructs are the basic building blocks of AWS CDK apps. They represent a "cloud component" and encapsulates everything AWS CloudFormation needs to create the component.
For quote mga for example, after defining all the [lambda functions for quot mga](../quotes/), we created a [construct](../infrastructure/quote-mga/lib/quote-sfn-construct.ts) in which we invoked all the lambda functions in one stepfunction. After that, we defined a stack for the deployment.


## What about multiple AWS Profiles?
All CDK commands accept the flag `--profile` to specify an AWS profile.

## HOWTO: Deploy the Stack

Normally, the Stack would only deploy *once* per account. To let developers experiment on their own, we augment the name of their current user from the Env Variables.
Thus a stack might look like `InfrastructureStack-lukas`, as its configured to set `InfrastructureStack-${process.env.USER}`.
Please be mindful of not wasting too much resources and destroy your respective stack after your tests with `pnpm cdk destroy`
