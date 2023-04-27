import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Context, Handler } from 'aws-lambda';
import {lambdaEvent, LambdaEvent, QuoteItem, StepFunctionsCall} from '@experiment/quote-types';
import { ContractResult, ContractState, ContractItem } from "@experiment/contract-types"

const metrics = new Metrics({ namespace: process.env.Namespace || 'noNamespaceDefined', serviceName: process.env.ServiceName || 'DefaultCreatePortalAccoutsName' });
const logger = new Logger({ serviceName: process.env.ServiceName || 'DefaultCreatePortalAccoutsName' });
const tracer = new Tracer({ serviceName: process.env.ServiceName || 'DefaultCreatePortalAccoutsName' });

export const handler: Handler<StepFunctionsCall<ContractItem>, ContractItem> = async (event:StepFunctionsCall<ContractItem>, _context: Context) => {
  tracer.getSegment();
  metrics.addMetric('successfulAccountCreation', MetricUnits.Count, 1);
  logger.info('Hello World and createPortalAccount');
  return event.Payload;
};