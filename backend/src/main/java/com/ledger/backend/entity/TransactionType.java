package com.ledger.backend.entity;

/**
 * A ledger entry is always one of these two types.
 * DEBIT  -> money leaving the account (balance decreases)
 * CREDIT -> money entering the account (balance increases)
 */
public enum TransactionType {
    DEBIT,
    CREDIT
}
