package com.ledger.backend.repository;

import com.ledger.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Ordered oldest -> newest so the running balance reads top to bottom
    List<Transaction> findByAccountIdOrderByTimestampAsc(Long accountId);
}
