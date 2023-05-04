import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { ContractSfnConstruct } from "@experiment/infrastructure-shared";
import { QuoteSfnConstruct } from "@experiment/infrastructure-shared";

export class ACMStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);
      const acmQuote = new QuoteSfnConstruct(this, "ACM-Quote", {
        quoteUnderwritingPath: path.join(__dirname, '..', 'node_modules', '@experiment-acm', 'quote-underwriting', 'dist'),
        filterProductsPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'filter-products', 'dist'),
        createQuotesPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'create-quotes', 'dist'),
        getAllAvailableProductsPath: path.join(__dirname, '..', 'node_modules', '@experiment-acm', 'get-all-available-products', 'dist'),
        calculateCommissionPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'calculate-commission', 'dist'),
        calculateTaxesPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'calculate-taxes', 'dist'),
        
        hasManualPath: true
      });

      const api_quote = new apigateway.StepFunctionsRestApi(this, 'ACMQuoteStepFunctionsRestApi', {
        stateMachine: acmQuote.stateMachine,
        // deployOptions: {
        //   stageName: "PROD"
        // },
        deploy: true,
        headers: true,
        path: true,
      });

      const acmContract = new ContractSfnConstruct(this, "ACM-Contract", {
        initiateContractPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'initiate-contract', 'dist'),
        applicationUnderwritingPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'application-underwriting', 'dist'),
        storeDocumentsPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'store-documents', 'dist'),
        collectConsentsPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'collect-consents', 'dist'),
        submitApplicationPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'submit-application', 'dist'),
        authorizePaymentPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'authorize-payment', 'dist'),
        issuePolicyPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'issue-policy', 'dist'),
        triggerVoiceOfCustomerPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'trigger-voice-of-customer', 'dist'),
        createPortalAccountPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'create-portal-acc', 'dist'),
        quoteStepFunctionARN: acmQuote.stateMachine.stateMachineArn,
        quoteRestApiId: api_quote.restApiId,
        testPath: path.join(__dirname, '..', 'node_modules', '@experiment-common', 'test', 'dist')
      });

      const api_contract = new apigateway.StepFunctionsRestApi(this, 'ACMContractStepFunctionsRestApi', {
        stateMachine: acmContract.stateMachine,
        // deployOptions: {
        //   stageName: "PROD"
        // },
        deploy: true,
        headers: true,
        path: true,
      });
    }
}
