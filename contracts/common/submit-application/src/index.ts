import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Context, Handler } from 'aws-lambda';
import {lambdaEvent, LambdaEvent, QuoteItem, StepFunctionsCall} from '@experiment/quote-types';
import { ContractResult, ContractState, ContractItem } from "@experiment/contract-types"

// todo: move to quote-types package
interface SubmitResult{
  appSumbitonState: boolean
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const metrics = new Metrics({ namespace: process.env.Namespace || 'noNamespaceDefined', serviceName: process.env.ServiceName || 'DefaultSubmitApplicationName' });
const logger = new Logger({ serviceName: process.env.ServiceName || 'DefaultSubmitApplicationName' });
const tracer = new Tracer({ serviceName: process.env.ServiceName || 'DefaultSubmitApplicationName' });
//StepFunctionsCall<QuoteItem>, QuoteItem
export const handler: Handler<StepFunctionsCall<ContractItem>, ContractItem> = async (event:StepFunctionsCall<ContractItem>, _context: Context) => {
  tracer.getSegment();
  metrics.addMetric('successfulappsubmited', MetricUnits.Count, 1);
  logger.info('Hello World and submit application');

  if (getRandomInt(10) % 4 == 0) {
    return { ...event.Payload, appSumbitonState: true }
  }

  if (getRandomInt(10) % 3 == 0) {
    return { ...event.Payload, appSumbitonState: true }
  }

  if (getRandomInt(10) % 2 == 0) {
    return { ...event.Payload, appSumbitonState: false }
  }

  return { ...event.Payload, appSumbitonState: true }
};