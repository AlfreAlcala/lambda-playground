import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Context, Handler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";
import { lambdaEvent, LambdaEvent, QuoteItem, quoteItemSchema, QuoteResult, StepFunctionsCall } from '@experiment/quote-types';

const metrics = new Metrics({ namespace: process.env.Namespace || 'noNamespaceDefined', serviceName: process.env.ServiceName || 'DefaultCreateQuotesName' });
const logger = new Logger({ serviceName: process.env.ServiceName || 'DefaultCreateQuotesName' });
const tracer = new Tracer({ serviceName: process.env.ServiceName || 'DefaultCreateQuotesName' });

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export const handler: Handler<StepFunctionsCall<QuoteResult>, QuoteItem> = async (event, _context: Context) => {
  tracer.getSegment();
  metrics.addMetric('successfulBooking', MetricUnits.Count, 1);
  logger.info('Hello World from createQuotes');
  // quoteItemSchema.parse(event.Payload)
  //return event.Payload;
  return { ...event.Payload, quoteId: uuidv4(), amount: ""+getRandomInt(11)};
};