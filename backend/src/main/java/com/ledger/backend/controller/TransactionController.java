package com.ledger.backend.controller;

import com.ledger.backend.dto.TransactionRequest;
import com.ledger.backend.dto.TransactionResponse;
import com.ledger.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts/{accountId}/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    /** POST /api/accounts/{accountId}/transactions - record a debit or credit entry */
    @PostMapping
    public ResponseEntity<TransactionResponse> recordTransaction(
            @PathVariable Long accountId,
            @Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = transactionService.recordTransaction(accountId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** GET /api/accounts/{accountId}/transactions - the full ledger (running balance history) */
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getLedger(@PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getLedgerForAccount(accountId));
    }
}
