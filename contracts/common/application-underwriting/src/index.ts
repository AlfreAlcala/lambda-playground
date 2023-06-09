import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { APIGatewayEvent, Context, Handler } from 'aws-lambda';
import { ContractResult, ContractState, ContractItem } from "@experiment/contract-types"
import { QuoteItem, QuoteResult, QuoteState, StepFunctionsCall } from '@experiment/quote-types'


const metrics = new Metrics({ namespace: process.env.Namespace || 'noNamespaceDefined', serviceName: process.env.ServiceName || 'DefaultApplicationUnderwriting' });
const logger = new Logger({ serviceName: process.env.ServiceName || 'DefaultApplicationUnderwriting' });
const tracer = new Tracer({ serviceName: process.env.ServiceName || 'DefaultApplicationUnderwriting' });

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export const handler: Handler<StepFunctionsCall<ContractItem>, ContractItem> = async (event:StepFunctionsCall<ContractItem>, _context: Context) => {
  tracer.getSegment();
  metrics.addMetric('successfulApplicationUnderwriting', MetricUnits.Count, 1);
  logger.info('Hello World from application underwriting');

  if (getRandomInt(10) % 4 == 0) {
    return { ...event.Payload, appUnderwritingState: ContractState.accepted }
  }

  if (getRandomInt(10) % 3 == 0) {
    return { ...event.Payload, appUnderwritingState: ContractState.accepted }
  }

  if (getRandomInt(10) % 2 == 0) {
    return { ...event.Payload, appUnderwritingState: ContractState.rejected }
  }

  return { ...event.Payload, appUnderwritingState: ContractState.accepted }
};