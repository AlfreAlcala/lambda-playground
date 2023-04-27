import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Context, Handler } from 'aws-lambda';
import { quoteItemSchema, StepFunctionsCall, QuoteResult } from '@experiment/quote-types';

const metrics = new Metrics({ namespace: process.env.Namespace || 'noNamespaceDefined', serviceName: process.env.ServiceName || 'DefaultFilterProductsName' });
const logger = new Logger({ serviceName: process.env.ServiceName || 'DefaultFilterProductsName' });
const tracer = new Tracer({ serviceName: process.env.ServiceName || 'DefaultFilterProductsName' });

export const handler: Handler<StepFunctionsCall<QuoteResult>, QuoteResult> = async (event, _context: Context) => {
  tracer.getSegment();
  metrics.addMetric('successfulBooking', MetricUnits.Count, 1);
  logger.info('Hello World from filterProdutcs');
  return event.Payload;
};