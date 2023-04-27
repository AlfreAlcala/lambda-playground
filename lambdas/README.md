# Welcome to your CDK Lambda TypeScript

Here is the place for the developers to write their code, the business logic.

Assuming you want to start to write your code and deploy it. Please make sure you already follow the instructions given in general [README](..//README.md)

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