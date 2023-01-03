import { Transaction } from "@prisma/client";

/**
 *  /users
 */
export interface UsersRequestBody {
    email: string;
    name?: string;
}

/**
 *  /users/:userId
 */
export interface UserRequestParams {
    userId: string;
}

export interface UsersTransactionsRequestParams extends UserRequestParams {
    transactionId: string;
}

/**
 *  /users/:userId/wallets
 */
export interface UserWalletsRequestBody {
    walletAddress: string;
    seedPhrase: string;
}

/**
 *  /users/:userId/wallets/:walletAddress
 */
export interface UserWalletsRequestParams extends UserRequestParams {
    walletAddress: string;
}

/**
 * /users/:userId/transactions
 */
export interface UserTransactionsRequestBody {
    transaction: Transaction;
}

/**
 * /explorer/transactions/:walletAddress
 */
export interface ExplorerTransactionsRequestParams {
    walletAddress: string;
}

/**
 * /explorer/transaction/:transactionHash
 */
export interface TransactionHashRequestParams {
    hash: string;
}
