import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Context, Handler } from 'aws-lambda';
import {lambdaEvent, LambdaEvent, QuoteItem, StepFunctionsCall} from '@experiment/quote-types';

const metrics = new Metrics({ namespace: process.env.Namespace || 'noNamespaceDefined', serviceName: process.env.ServiceName || 'DefaultGetProductsName' });
const logger = new Logger({ serviceName: process.env.ServiceName || 'DefaultGetProductsName' });
const tracer = new Tracer({ serviceName: process.env.ServiceName || 'DefaultGetProductsName' });

export const handler: Handler<StepFunctionsCall<QuoteItem>, QuoteItem> = async (event:StepFunctionsCall<QuoteItem>, _context: Context) => {
  tracer.getSegment();
  metrics.addMetric('successfulBooking', MetricUnits.Count, 1);
  logger.info('Hello World from getProducts');
  quoteItemSchema.parse(event.Payload)
  return event.Payload;
};