import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Context, Handler } from 'aws-lambda';
import { QuoteResult, QuoteState } from "@experiment/quote-types"

const metrics = new Metrics({ namespace: process.env.Namespace || 'noNamespaceDefined', serviceName: process.env.ServiceName || 'DefaultQuoteUnderwritingName' });
const logger = new Logger({ serviceName: process.env.ServiceName || 'DefaultQuoteUnderwritingName' });
const tracer = new Tracer({ serviceName: process.env.ServiceName || 'DefaultQuoteUnderwritingName' });

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export const handler: Handler<any, QuoteResult> = async (_event, _context: Context) => {
  tracer.getSegment();
  metrics.addMetric('successfulBooking', MetricUnits.Count, 1);
  logger.info('Hello World from underwriting quote');

  if (getRandomInt(10) % 4 == 0) {
    return { underwritingState: QuoteState.manual }
  }

  if (getRandomInt(10) % 3 == 0) {
    return { underwritingState: QuoteState.rejected }
  }

  if (getRandomInt(10) % 2 == 0) {
    return { underwritingState: QuoteState.limited }
  }

  return { underwritingState: QuoteState.success }
};