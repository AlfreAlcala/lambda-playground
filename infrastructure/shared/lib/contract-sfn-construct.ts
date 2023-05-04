import { CfnOutput, Duration, Stack, StackProps, Tags } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as sfntasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from 'constructs';
import * as dynamo from "aws-cdk-lib/aws-dynamodb"
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Fail, Pass } from 'aws-cdk-lib/aws-stepfunctions';
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export interface ContractConstructProps {
    initiateContractPath: string,
    applicationUnderwritingPath: string,
    storeDocumentsPath: string,
    collectConsentsPath: string,
    submitApplicationPath: string,
    authorizePaymentPath: string,
    issuePolicyPath: string,
    triggerVoiceOfCustomerPath: string,
    createPortalAccountPath: string,
    quoteStepFunctionARN: string,
    quoteRestApiId: string
}

export class ContractSfnConstruct extends Construct {

    /** allows accessing the counter function */
    public readonly stateMachine: sfn.IStateMachine;

    constructor(scope: Construct, id: string, props: ContractConstructProps) {
        super(scope, id);

        const logGroup = new logs.LogGroup(this, 'StepFunctionsLG');

        const quoteSFN = sfn.StateMachine.fromStateMachineArn(scope, `${id}-quote`, props.quoteStepFunctionARN)

        const quoteApi = apigateway.StepFunctionsRestApi.fromRestApiId(scope, `${id}-RestApi`, props.quoteRestApiId)

        const dynamoTable = new dynamo.Table(this, "Quote", {
            partitionKey: {name:"contractId", type: dynamo.AttributeType.STRING}
        })

        const unsuccessfulSubmitionQueue = new sqs.Queue(this, 'UnsuccessfulSubmitionQueue')

        const initiateContractLambda = new lambda.Function(this, 'InitiateContract', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "initiateContract"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.initiateContractPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const applicationUnderwritingLambda = new lambda.Function(this, 'ApplicationUnderwriting', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "applicationUnderwriting"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.applicationUnderwritingPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const storeDocumentsLambda = new lambda.Function(this, 'storeDocuments', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "storeDocuments"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.storeDocumentsPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const collectConsentsLambda = new lambda.Function(this, 'collectConsents', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "collectConsents"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.collectConsentsPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const submitApplicationLambda = new lambda.Function(this, 'submitApplication', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "submitApplication"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.submitApplicationPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const authorizePaymentLambda = new lambda.Function(this, 'authorizePayment', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "authorizePayment"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.authorizePaymentPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const issuePolicyPathLambda = new lambda.Function(this, 'issuePolicy', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "issuePolicy"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.issuePolicyPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const triggerVoiceOfCustomerLambda = new lambda.Function(this, 'triggerVoiceOfCustomer', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "triggerVoiceOfCustomer"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.triggerVoiceOfCustomerPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const createPortalAccountLambda = new lambda.Function(this, 'createPortalAccount', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            environment: {
                Namespace: id,
                ServiceName: "createPortalAccount"
            },
            // TODO: Zip in Turbo already
            code: lambda.Code.fromAsset(props.createPortalAccountPath),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64
        });

        const filterFailureMessage = new Pass(this, "Filter Error Message", {})

        const errorState = new Fail(this, "Error Handled", {})
        filterFailureMessage.next(errorState)

        const invokeInitiateContractLambda = new sfntasks.LambdaInvoke(this, 'Initiate Contract', {
            lambdaFunction: initiateContractLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            resultPath: "$.body.Payload",
            comment: "Initiate Contract",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })
        const invokeApplicationUnderwritingLambda = new sfntasks.LambdaInvoke(this, 'Application Underwriting', {
            lambdaFunction: applicationUnderwritingLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Application Underwriting",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })
        const invokeStoreDocumentsLambda = new sfntasks.LambdaInvoke(this, 'Store Documents', {
            lambdaFunction: storeDocumentsLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Store Documents",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })
        const invokeCollectConsentsLambda = new sfntasks.LambdaInvoke(this, 'Collect Consent', {
            lambdaFunction: collectConsentsLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Collect Consent",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })
        const invokeSubmitApplicationLambda = new sfntasks.LambdaInvoke(this, 'Submit Application', {
            lambdaFunction: submitApplicationLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Submit Application",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })
        const invokeAuthorizePaymentLambda = new sfntasks.LambdaInvoke(this, 'Authorize Payment', {
            lambdaFunction: authorizePaymentLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Authorize Payment",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })
        const invokeIssuePolicyLambda = new sfntasks.LambdaInvoke(this, 'Issue Policy', {
            lambdaFunction: issuePolicyPathLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Issue Policy",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })
        const invokeTriggerVoiceOfCustomerLambda = new sfntasks.LambdaInvoke(this, 'Trigger Voice of customer', {
            lambdaFunction: triggerVoiceOfCustomerLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Trigger Voice of customer",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })
        const invokeCreatePortalAccountLambda = new sfntasks.LambdaInvoke(this, 'Create Portal Account', {
            lambdaFunction: createPortalAccountLambda,
            payload: sfn.TaskInput.fromJsonPathAt('$'),
            comment: "Create Portal Account",
            retryOnServiceExceptions: true,
            taskTimeout: sfn.Timeout.duration(Duration.minutes(1))
        })

        // const invokeQuoteStepFunction = new sfntasks.StepFunctionsStartExecution(this, 'QuoteStepFunction', {
        //     stateMachine: quoteSFN,
        //     integrationPattern: sfn.IntegrationPattern.RUN_JOB,
        //     resultPath: "$.Output"
        // });

        const invokeQuoteRespAPI = new sfntasks.CallApiGatewayRestApiEndpoint(this, 'QuoteRestApi', {
            api: quoteApi,
            // stageName: quoteApi.deploymentStage.stageName,
            stageName: 'prod',
            method: sfntasks.HttpMethod.POST,
            integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
            requestBody: sfn.TaskInput.fromJsonPathAt('$.Payload'),
            inputPath: "$.body.Payload",
            resultPath: "$.Output"
            // headers: sfn.TaskInput.fromJsonPathAt('$.header'),
            // apiPath: sfn.JsonPath.stringAt('$.path'),
        });

        const persistDraftContract = new sfntasks.DynamoPutItem(this, 'Persist Draft Contract', {
            item: {
              contractId: sfntasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.body.Payload.Payload.contractId')),
              quoteId: sfntasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.body.Payload.Payload.quoteId')),
              contract_status: sfntasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.body.Payload.Payload.status'))
            },
            table: dynamoTable,
            resultPath: sfn.JsonPath.DISCARD
        });

        const persistContract = new sfntasks.DynamoUpdateItem(this, 'Persist Contract', {
            key: {
                contractId: sfntasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.Payload.contractId'))
            },
            table: dynamoTable,
            expressionAttributeValues: {
              ":quoteId": sfntasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.Payload.quoteId')),
              ":contract_status": sfntasks.DynamoAttributeValue.fromString("Created"),
            },
            updateExpression: 'SET quoteId = :quoteId, contract_status = :contract_status',
            resultPath: sfn.JsonPath.DISCARD
        });

        const persistFailedContract = new sfntasks.DynamoUpdateItem(this, 'Persist failed Contract', {
            key: {
                contractId: sfntasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.Payload.contractId'))
            },
            table: dynamoTable,
            expressionAttributeValues: {
              ":quoteId": sfntasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.Payload.quoteId')),
              ":contract_status": sfntasks.DynamoAttributeValue.fromString("Failed"),
            },
            updateExpression: 'SET quoteId = :quoteId, contract_status = :contract_status',
            resultPath: sfn.JsonPath.DISCARD
        });

        const passChildSFNOutput = new sfn.Pass(this, "Pass-through combine selected items only", {
            parameters: {
                "contractId.$": "$.body.Payload.Payload.contractId",
                "quoteId.$": "$.body.Payload.Payload.quoteId",
                "status.$": "$.body.Payload.Payload.status",
                "underwritingState.$": "$.Output.ResponseBody.underwritingState"
            }
        })

        const passWrapToPayload = new sfn.Pass(this, "Pass-through wrap to Payload", {
            parameters: {
                "Payload.$": "$"
            }
        })

        // const passFilterInput = new sfn.Pass(this, "Pass-through only relevant data", {
        //     parameters: {
        //         "contractId.$": "$.Payload.contractId",
        //         "quoteId.$": "$.Payload.quoteId",
        //         "status.$": "$.Payload.status",
        //         "appSumbitonState.$": "$.SumbitOutput.Payload.appSumbitonState"
        //     }
        // })

        const handleQuoteResults = new sfn.Choice(this, "Handle Quote Results", {})
        const handleAppticationUnderwritingResults = new sfn.Choice(this, "Handle Application Underwriting Results", {})
        const handleApplicationSubmited = new sfn.Choice(this, "Handle submition state", {})
        const invokeParalelExecution = new sfn.Parallel(this, "InvokeParalelExecutonOfLambdas", {
            resultPath: sfn.JsonPath.DISCARD
        })
        const success = new sfn.Succeed(this, "Success")
        const fail = new sfn.Fail(this, "Contract Creation Failed", {
            error: "Contract Creation Failed"
        })

        const sendMessageToUnssucessfulQueue = new sfntasks.SqsSendMessage(this, 'Send Message To Unssucessful Queue', {
            queue: unsuccessfulSubmitionQueue,
            messageBody: sfn.TaskInput.fromText('Failed to sumbit contract!'),
            resultPath: sfn.JsonPath.DISCARD
        })


        invokeInitiateContractLambda.next(persistDraftContract)
        // persistDraftContract.next(invokeQuoteStepFunction)
        // invokeQuoteStepFunction.next(passChildSFNOutput)
        persistDraftContract.next(invokeQuoteRespAPI)
        invokeQuoteRespAPI.next(passChildSFNOutput)
        passChildSFNOutput.next(passWrapToPayload)
        passWrapToPayload.next(handleQuoteResults)
        handleQuoteResults.when(sfn.Condition.and(sfn.Condition.isPresent("$.Payload.underwritingState"), sfn.Condition.or(sfn.Condition.stringEquals("$.Payload.underwritingState", "limited"), sfn.Condition.stringEquals("$.Payload.underwritingState", "success"))), invokeApplicationUnderwritingLambda)
        handleQuoteResults.otherwise(persistFailedContract)

        invokeApplicationUnderwritingLambda.next(handleAppticationUnderwritingResults)
        handleAppticationUnderwritingResults.when(sfn.Condition.stringEquals("$.Payload.appUnderwritingState", "accepted"), invokeStoreDocumentsLambda)
        handleAppticationUnderwritingResults.otherwise(persistFailedContract)

        invokeStoreDocumentsLambda.next(invokeCollectConsentsLambda)
        invokeCollectConsentsLambda.next(invokeSubmitApplicationLambda)
        invokeSubmitApplicationLambda.next(handleApplicationSubmited)
        // passFilterInput.next(handleApplicationSubmited)

        handleApplicationSubmited.when(sfn.Condition.booleanEquals("$.Payload.appSumbitonState", true), invokeAuthorizePaymentLambda)
        handleApplicationSubmited.otherwise(sendMessageToUnssucessfulQueue)
        sendMessageToUnssucessfulQueue.next(persistFailedContract)

        persistFailedContract.next(fail)

        invokeAuthorizePaymentLambda.next(invokeParalelExecution)
        invokeParalelExecution.branch(invokeIssuePolicyLambda).branch(invokeTriggerVoiceOfCustomerLambda).branch(invokeCreatePortalAccountLambda).next(persistContract)

        persistContract.next(success)


        this.stateMachine = new sfn.StateMachine(this, id, {
            definition: invokeInitiateContractLambda,
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