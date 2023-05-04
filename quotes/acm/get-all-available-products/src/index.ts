import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Context, Handler } from 'aws-lambda';
import { QuoteItem, APIGatewayInputType, APIGatewayInputSchema} from '@experiment/quote-types';

const metrics = new Metrics({ namespace: process.env.Namespace || 'noNamespaceDefined', serviceName: process.env.ServiceName || 'DefaultGetAllAvailableProductsName' });
const logger = new Logger({ serviceName: process.env.ServiceName || 'DefaultGetAllAvailableProductsName' });
const tracer = new Tracer({ serviceName: process.env.ServiceName || 'DefaultGetAllAvailableProductsName' });

export const handler: Handler<APIGatewayInputType, QuoteItem> = async (event:APIGatewayInputType, _context: Context) => {
  tracer.getSegment();
  metrics.addMetric('successfulBooking', MetricUnits.Count, 1);
  logger.info('Hello World and getAllAvailableProducts');
  APIGatewayInputSchema.parse(event)
  return {quoteId: "notset", amount: "0"};
};