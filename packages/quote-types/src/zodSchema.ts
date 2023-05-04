import { z } from "zod";

 export const lambdaEvent = z.object({
    id: z.string()
  })
  
  export type LambdaEvent = z.infer<typeof lambdaEvent>;