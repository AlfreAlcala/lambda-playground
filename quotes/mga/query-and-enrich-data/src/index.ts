import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Context, Handler } from 'aws-lambda';
import { APIGatewayInputType, APIGatewayInputSchema, QuoteItem, quoteItemSchema} from "@experiment/quote-types"

const metrics = new Metrics({ namespace: process.env.Namespace || 'noNamespaceDefined', serviceName: process.env.ServiceName || 'DefaultQueryAndEnrichDataName' });
const logger = new Logger({ serviceName: process.env.ServiceName || 'DefaultQueryAndEnrichDataName' });
const tracer = new Tracer({ serviceName: process.env.ServiceName || 'DefaultQueryAndEnrichDataName' });

export const handler: Handler<APIGatewayInputType, QuoteItem> = async (event:APIGatewayInputType, _context: Context) => {
  tracer.getSegment();
  metrics.addMetric('successfulBooking', MetricUnits.Count, 1);
  logger.info('Hello World from query and enrich data');

  try{

    APIGatewayInputSchema.parse(event);

    /*
    TODO: Reenable this

    if(!event.body){
      throw new Error("No Body was submitted")
    }*/


    // const eventBody = event.body;

    // TODO: Comment that in :)
    // quoteItemSchema.parse(eventBody)

    // TODO: We really should re-enable throwing an error, when the body is null
    return {quoteId: "notset", amount: "0"};
  }catch(e){
    logger.error("Failure upon parsing APIGatewayInputSchema");
    throw e;
  }

};