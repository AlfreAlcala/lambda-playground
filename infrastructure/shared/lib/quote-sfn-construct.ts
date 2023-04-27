import { CfnOutput, Duration, Stack, StackProps, Tags } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as sfntasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from 'constructs';
import * as dynamo from "aws-cdk-lib/aws-dynamodb"
import * as sqs from 'aws-cdk-lib/aws-sqs'
import { Pass, Fail } from 'aws-cdk-lib/aws-stepfunctions';

export interface QuoteConstructProps {
    queryAndEnrichDataPath?: string,
    quoteUnderwritingPath: string,
    filterProductsPath: string,
    createQuotesPath: string,
    getAllAvailableProductsPath: string,
    calculateCommissionPath: string,
    calculateTaxesPath: string,
    hasManualPath?: boolean
}

export class QuoteSfnConstruct extends Construct {

    /** allows accessing the counter function */
    public readonly stateMachine: sfn.IStateMachine;

    constructor(scope: Construct, id: string, props: QuoteConstructProps) {
        super(scope, id);

        let invokeQueryAndEnrichDataLambda = undefined;
        const logGroup = new logs.LogGroup(this, 'StepFunctionsLG');

        const dynamoTable = new dynamo.Table(this, "Quote", {
            partitionKey: {name:"quoteId", type: dynamo.AttributeType.STRING}
          })


        const filterFailureMessage = new Pass(this, "Filter Error Message", {})

        const errorState = new Fail(this, "Error Handled", {})
        filterFailureMessage.next(errorState)

        if( props.queryAndEnrichDataPath ){
            const queryAndEnrichDataLambda = new lambda.Function(this, 'QueryAndEnrichData', {
                runtime: lambda.Runtime.NODEJS_18_X,
                handler: 'index.handler',
                environment: {
                    Namespace: id,
                    ServiceName: "queryAndEnrichData"
                },
                // TODO: Zip in Turbo already
                code: lambda.Code.fromAsset(props.queryAndEnrichDataPath),
                tracing: lambda.Tracing.ACTIVE,
                architecture: lambda.Architecture.ARM_64
            });

            invokeQueryAndEnrichDataLambda = new sfntasks.LambdaInvoke(this, 'Invoke Querying and Enriching Data', {
                lambdaFunction: queryAndEnrichDataLambda,
                payload: sfn.TaskInput.fromJsonPathAt('$'),
                comment: "Invoke Query and Enrich Lambda",
                retryOnServiceExceptions: true,
                taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
            })
            invokeQueryAndEnrichDataLambda.addCatch(filterFailureMessage)
        }

        const quoteUnderwritingLambda = new lambda.Function(this, 'QuoteUnderwriting', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "underwriting"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.quoteUnderwritingPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const invokeQuoteUnderwritingLambda = new sfntasks.LambdaInvoke(this, 'Invoke Underwriting', {
            lambdaFunction: quoteUnderwritingLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Invoke Underwriting Lambda",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })
        invokeQuoteUnderwritingLambda.addCatch(filterFailureMessage)

        const filterProductsLambda = new lambda.Function(this, 'FilterProducts', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "filterProdutcs"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.filterProductsPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const invokefilterProductsLambda = new sfntasks.LambdaInvoke(this, 'Invoke Filter Products', {
            lambdaFunction: filterProductsLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Invoke Filter Products Lambda",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })

        invokefilterProductsLambda.addCatch(filterFailureMessage)

        const createQuotesLambda = new lambda.Function(this, 'CreateQuotes', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "createQuotes"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.createQuotesPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const invokeCreateQuotesLambda = new sfntasks.LambdaInvoke(this, 'Invoke Creating Quotes', {
            lambdaFunction: createQuotesLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Invoke Creation Quotes Lambda",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })
        invokeCreateQuotesLambda.addCatch(filterFailureMessage)

        const getAllAvailableProductsLambda = new lambda.Function(this, 'GetAllAvailableProducts', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "getAllAvailableProducts"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.getAllAvailableProductsPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const invokeGetAllAvailableProductsLambda = new sfntasks.LambdaInvoke(this, 'Invoke Getting all Available Products', {
            lambdaFunction: getAllAvailableProductsLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Invoke Get all available Products Lambda",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })
        invokeGetAllAvailableProductsLambda.addCatch(filterFailureMessage)

        const calculateCommissionLambda = new lambda.Function(this, 'CalculateCommission', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "calculateCommission"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.calculateCommissionPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const invokeCalculateCommissionLambda = new sfntasks.LambdaInvoke(this, 'Invoke Calculating Commission', {
            lambdaFunction: calculateCommissionLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Invoke Calculate Commission Lambda",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })
        invokeCalculateCommissionLambda.addCatch(filterFailureMessage)

        const calculateTaxesLambda = new lambda.Function(this, 'CalculateTaxes', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "calculateTaxes"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.calculateTaxesPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const invokeCalculateTaxesLambda = new sfntasks.LambdaInvoke(this, 'Invoke Calculating Taxes', {
            lambdaFunction: calculateTaxesLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Invoke Calculate Taxes Lambda",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })
        invokeCalculateTaxesLambda.addCatch(filterFailureMessage)

        const handleUnderwritingResults = new sfn.Choice(this, "Handle Underwriting Results", {})

        const pass = new sfn.Pass(this, "Pass-through Payload only", {
            outputPath: "$.Payload"
        })

        const persistQuote = new sfntasks.DynamoPutItem(this, 'Persist Quote', {
            item: {
              quoteId: sfntasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.Payload.quoteId')),
              amount: sfntasks.DynamoAttributeValue.numberFromString(sfn.JsonPath.stringAt('$.Payload.amount')),
            },
            table: dynamoTable,
            resultPath: sfn.JsonPath.DISCARD
        });
        persistQuote.addCatch(filterFailureMessage)

        const success = new sfn.Succeed(this, "Success")
        const fail = new sfn.Fail(this, "Underwriting Failed", {
            error: "Underwriting Failed"
        })

        if( invokeQueryAndEnrichDataLambda != undefined ){
            // Invoke Query and Enrich => Invoke Get All Available Products
            invokeQueryAndEnrichDataLambda.next(invokeGetAllAvailableProductsLambda)
        }

        // Invoke Get All Available Products => Invoke Underwriting
        invokeGetAllAvailableProductsLambda.next(invokeQuoteUnderwritingLambda)

        // Invoke Underwriting => Handle Underwriting Results (Choice State)
        invokeQuoteUnderwritingLambda.next(handleUnderwritingResults)

        // Handle State limited
        handleUnderwritingResults.when(sfn.Condition.stringEquals("$.Payload.underwritingState", "limited"), invokefilterProductsLambda)


        if( props.hasManualPath ){
            // Handle State manual
            const manualQueue = new sqs.Queue(this, 'ManualQueue')
            const sendMessageToUnssucessfulQueue = new sfntasks.SqsSendMessage(this, 'Send Message To Unssucessful Queue', {
                queue: manualQueue,
                messageBody: sfn.TaskInput.fromText('Manual quote type!'),
                resultPath: sfn.JsonPath.DISCARD
            })
            sendMessageToUnssucessfulQueue.addCatch(filterFailureMessage)
            handleUnderwritingResults.when(sfn.Condition.stringEquals("$.Payload.underwritingState", "manual"), sendMessageToUnssucessfulQueue)
            sendMessageToUnssucessfulQueue.next(pass)
        }

        // Handle State rejected
        handleUnderwritingResults.when(sfn.Condition.stringEquals("$.Payload.underwritingState", "rejected"), fail)

        // Handle default case
        handleUnderwritingResults.otherwise(invokeCreateQuotesLambda)

        // Invoke Filter Products => Invoke Creating Quotes (back to the default case)
        invokefilterProductsLambda.next(invokeCreateQuotesLambda)
        // Invoke Create Quotes => Persist Quote
        invokeCreateQuotesLambda.next(persistQuote)
        // Persist Quote => Invoke Calculate Comissions
        persistQuote.next(invokeCalculateCommissionLambda)
        // Invoke Calculate Comissions => Invoke Calculate Taxes
        invokeCalculateCommissionLambda.next(invokeCalculateTaxesLambda)
        // Invoke Calculate Taxes => Filter Return Payload
        invokeCalculateTaxesLambda.next(pass)
        // Filter Return Payload => Success
        pass.next(success)


        this.stateMachine = new sfn.StateMachine(this, id, {
            definition: invokeQueryAndEnrichDataLambda != undefined ? invokeQueryAndEnrichDataLambda : invokeGetAllAvailableProductsLambda,
            tracingEnabled: true,
            logs: {
                destination: logGroup,
                level: sfn.LogLevel.ALL,
                includeExecutionData: true
            },
            stateMachineType: sfn.StateMachineType.EXPRESS
        })

        new CfnOutput(this, "StepFunctionArn", {
            value: this.stateMachine.stateMachineArn
        })
    }
}