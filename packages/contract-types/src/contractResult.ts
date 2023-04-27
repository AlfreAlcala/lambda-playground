export enum ContractState {
    "accepted" = "accepted",
    "rejected" = "rejected"
}

export interface ContractResult{
    appUnderwritingState: ContractState
}