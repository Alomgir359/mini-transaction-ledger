package com.ledger.backend.service;

import com.ledger.backend.dto.TransactionRequest;
import com.ledger.backend.dto.TransactionResponse;
import com.ledger.backend.entity.Account;
import com.ledger.backend.entity.Transaction;
import com.ledger.backend.entity.TransactionType;
import com.ledger.backend.exception.InsufficientBalanceException;
import com.ledger.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Owns the core ledger rule: every posted entry must update the account's
 * balance atomically, and every entry must remember what the balance was
 * right after it was applied (so the ledger can be replayed / audited).
 */
@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountService accountService;

    public TransactionService(TransactionRepository transactionRepository,
                               AccountService accountService) {
        this.transactionRepository = transactionRepository;
        this.accountService = accountService;
    }

    /**
     * Records a new debit or credit against an account and recomputes its
     * running balance. Runs inside a single DB transaction so the account
     * balance update and the transaction row are never left inconsistent.
     */
    @Transactional
    public TransactionResponse recordTransaction(Long accountId, TransactionRequest request) {
        Account account = accountService.findAccountOrThrow(accountId);

        BigDecimal currentBalance = account.getBalance();
        BigDecimal newBalance;

        if (request.getType() == TransactionType.CREDIT) {
            newBalance = currentBalance.add(request.getAmount());
        } else { // DEBIT
            newBalance = currentBalance.subtract(request.getAmount());
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException(
                        "Insufficient balance: available " + currentBalance
                                + ", requested debit " + request.getAmount());
            }
        }

        Transaction transaction = new Transaction(
                account,
                request.getType(),
                request.getAmount(),
                request.getDescription(),
                newBalance
        );

        account.setBalance(newBalance);
        accountService.save(account);
        Transaction saved = transactionRepository.save(transaction);

        return new TransactionResponse(saved);
    }

    public List<TransactionResponse> getLedgerForAccount(Long accountId) {
        // Ensures a 404 is raised for an unknown account instead of an empty list
        accountService.findAccountOrThrow(accountId);

        return transactionRepository.findByAccountIdOrderByTimestampAsc(accountId)
                .stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
    }
}
