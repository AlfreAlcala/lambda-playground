import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from "path";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { QuoteSfnConstruct } from '@experiment/infrastructure-shared';



export class QuoteMGAStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here


    const mgaQuote = new QuoteSfnConstruct(this, "MGA-Quote", {
      queryAndEnrichDataPath: path.join(__dirname, '..', 'node_modules', '@experiment-mga', 'query-and-enrich-data', 'dist'),
      quoteUnderwritingPath: path.join(__dirname, '..', 'node_modules', '@experiment-mga', 'quote-underwriting', 'dist'),
      filterProductsPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'filter-products', 'dist'),
      createQuotesPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'create-quotes', 'dist'),
      getAllAvailableProductsPath: path.join(__dirname, '..', 'node_modules', '@experiment-mga', 'get-all-available-products', 'dist'),
      calculateCommissionPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'calculate-commission', 'dist'),
      calculateTaxesPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'calculate-taxes', 'dist')
    });

    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway-readme.html#aws-stepfunctions-backed-APIs
    const api = new apigateway.StepFunctionsRestApi(this, 'MGA-Quote-Api', {
      stateMachine: mgaQuote.stateMachine,
      deploy: true,
      headers: true,
      path: true,
    });

  }
}
