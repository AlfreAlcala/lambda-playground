import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Context, Handler } from 'aws-lambda';
import {APIGatewayInputType, APIGatewayInputSchema} from '@experiment/quote-types';
import { v4 as uuidv4 } from 'uuid';
import { ContractItem } from "@experiment/contract-types"

const metrics = new Metrics({ namespace: process.env.Namespace || 'noNamespaceDefined', serviceName: process.env.ServiceName || 'DefaultInitiateContract' });
const logger = new Logger({ serviceName: process.env.ServiceName || 'DefaultInitiateContract' });
const tracer = new Tracer({ serviceName: process.env.ServiceName || 'DefaultInitiateContract' });

export const handler: Handler<APIGatewayInputType, ContractItem> = async (event:APIGatewayInputType, _context: Context) => {
  tracer.getSegment();
  metrics.addMetric('successfulInitiateContract', MetricUnits.Count, 1);
  logger.info('Hello World from initiate contract');
  APIGatewayInputSchema.parse(event)
  // return event.payload
  //return event?.Payload || event;

  return {contractId: uuidv4(), quoteId: "notset", status: "Draft", underwritingState: "notSet"};
};