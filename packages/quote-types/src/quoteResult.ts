export enum QuoteState {
    "limited" = "limited",
    "success" = "success",
    "rejected" = "rejected",
    "manual" = "manual"
}

export interface QuoteResult{
    underwritingState: QuoteState
}