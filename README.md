# Lambda Playground

In this README.md, you will fine the general documentation of what you need to know to start with this project. For specific documentation, please see the README.md in the other folders.

This is a very basic Lambda Playground monorepo to kick it off...the main langauge is **Typescript**, we use
[pnpm](https://pnpm.io) workspaces (so be sure to understand that) and [Turborepo](https://turbo.build/repo) to build.

Here are the links to the AWS env through ACN SSO for the different squad

**[Jump link to current AWS env through ACN SSO - Germany](https://myapps.microsoft.com/signin/113614_284875872477_ACP_AWS_APP/033fb688-92c5-4a87-a63a-f54dc8972a99?tenantId=e0793d39-0939-496d-b129-198edd916feb)**

**[Jump link to current AWS env through ACN SSO  - Italy](https://myapps.microsoft.com/signin/113614_789716828779_ACP_AWS_APP/159f9540-7864-4a19-9055-78774adf0161?tenantId=e0793d39-0939-496d-b129-198edd916feb)**

**[Jump link to current AWS env through ACN SSO   - Spain](https://myapps.microsoft.com/signin/113614_498760005782_ACP_AWS_APP/772bc2fe-7407-4c5d-9d4e-455bb3fe7b12?tenantId=e0793d39-0939-496d-b129-198edd916feb)**

The repo is currently structured like follows:
# lambda-playground

* [.github/](./lambda-playground/.github)
  * [workflows/](./lambda-playground/.github/workflows)
    * [aws.yml](./lambda-playground/.github/workflows/aws.yml)
* [contracts/](./lambda-playground/contracts) (This folder is expected to house all the lambda functions regarding contracts)
  * [common/](./lambda-playground/contracts/common)
    * [application-underwriting/](./lambda-playground/contracts/common/application-underwriting)
    * [authorize-payment/](./lambda-playground/contracts/common/authorize-payment)
    * [collect-consents/](./lambda-playground/contracts/common/collect-consents)
    * [create-portal-acc/](./lambda-playground/contracts/common/create-portal-acc)
    * [initiate-contract/](./lambda-playground/contracts/common/initiate-contract)
    * [issue-policy/](./lambda-playground/contracts/common/issue-policy)
    * [store-documents/](./lambda-playground/contracts/common/store-documents)
    * [submit-application/](./lambda-playground/contracts/common/submit-application)
    * [trigger-voice-of-customer/](./lambda-playground/contracts/common/trigger-voice-of-customer)
* [docs/](./lambda-playground/docs) (this folder is expected to house all the architecture decisions)
  * [decisions/](./lambda-playground/docs/decisions)
* [infrastructure/](./lambda-playground/infrastructure) (this folder is expected to house all things CDK, i.e. Apps, Constructs, ...)
  * [quote-mga/](./lambda-playground/infrastructure/quote-mga)
  * [shared/](./lambda-playground/infrastructure/shared)
  * [users/](./lambda-playground/infrastructure/users)
  * [README.md](./lambda-playground/infrastructure/README.md)
* [lambdas/](./lambda-playground/lambdas)
  * [java-example/](./lambda-playground/lambdas/java-example)
  * [README.md](./lambda-playground/lambdas/README.md)
* [packages/](./lambda-playground/packages)
  * [contract-types/](./lambda-playground/packages/contract-types)
  * [eslint-config-custom/](./lambda-playground/packages/eslint-config-custom)
  * [quote-types/](./lambda-playground/packages/quote-types)
  * [tsconfig/](./lambda-playground/packages/tsconfig)
  * [tsup-config/](./lambda-playground/packages/tsup-config)
* [quotes/](./lambda-playground/quotes) (This folder is expected to house all the lambda functions regarding quotes)
  * [acm/](./lambda-playground/quotes/acm)
    * [quote-underwriting/](./lambda-playground/quotes/acm/quote-underwriting)
  * [common/](./lambda-playground/quotes/common)
    * [calculate-commission/](./lambda-playground/quotes/common/calculate-commission)
    * [calculate-taxes/](./lambda-playground/quotes/common/calculate-taxes)
    * [create-quotes/](./lambda-playground/quotes/common/create-quotes)
    * [filter-products/](./lambda-playground/quotes/common/filter-products)
    * [get-all-available-products/](./lambda-playground/quotes/common/get-all-available-products)
    * [get-products/](./lambda-playground/quotes/common/get-products)
  * [mga/](./lambda-playground/quotes/mga)
    * [query-and-enrich-data/](./lambda-playground/quotes/mga/query-and-enrich-data)
    * [quote-underwriting/](./lambda-playground/quotes/mga/quote-underwriting)
* [.eslintrc.js](./lambda-playground/.eslintrc.js)
* [.gitignore](./lambda-playground/.gitignore)
* [.npmrc](./lambda-playground/.npmrc)
* [.pre-commit-config.yaml](./lambda-playground/.pre-commit-config.yaml)
* [README.md](./lambda-playground/README.md)
* [package.json](./lambda-playground/package.json)
* [pnpm-lock.yaml](./lambda-playground/pnpm-lock.yaml)
* [pnpm-workspace.yaml](./lambda-playground/pnpm-workspace.yaml)
* [turbo.json](./lambda-playground/turbo.json)


## Prerequisites

This is a monorepo with [Turborepo](https://turbo.build/repo) as build tool and
[pnpm](https://pnpm.io) as package manager plus some Java stuff.
Make sure you have installed:

- [Node.js LTS](https://nodejs.org/) - we're using version 18
- [Java](https://www.oracle.com/java/technologies/downloads/) - please note it should be minimum version 11 (version supported on AWS Lambda, target version) - switch to 17 expected soon - For the best experience we reccomend using [Corretto 11](https://docs.aws.amazon.com/de_de/corretto/latest/corretto-11-ug/downloads-list.html)
- [Gradle](https://gradle.org)


## Initialization

This is a monorepo with Turborepo as build tool and pnpm as package manager.
Make sure you have [Node.js LTS (18)](https://nodejs.org/) installed:

Note: Don't use yarn for installation. Only pnpm has to be used.

Activate / update pnpm:

```shell
# install / update / activate pnpm
corepack prepare pnpm@8.3.0 --activate
```

```shell
# install turbo
pnpm install turbo -w

# install all deps of all projects in the workspace
pnpm install

# full build
pnpm build
```

_Then_ you can switch into `infrastructure/serverless` and start playing - also check-out
the [README](./infrastructure/README.md) to connect to the AWS account.

By running all tools _through_ pnpm you ensure consistent version usage so there's no
fallback to globally installed versions that are not up-to-date.

## Documenting Architecture Decisions - Architecture Decision Record (ADR)

The architectural decions in this project are documented following Architecture Decision Record method.

The used template is the one of **[Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)**.