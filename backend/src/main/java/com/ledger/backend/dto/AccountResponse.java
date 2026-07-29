package com.ledger.backend.dto;

import com.ledger.backend.entity.Account;
import com.ledger.backend.entity.AccountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * What we send back to the client for an account - deliberately separate
 * from the JPA entity so we never leak persistence internals (e.g. the
 * lazy transactions collection) through the API.
 */
public class AccountResponse {

    private Long id;
    private String accountNumber;
    private String accountHolderName;
    private AccountType accountType;
    private String nid;
    private String fatherName;
    private String motherName;
    private String nomineeName;
    private String nomineeNid;
    private String nomineeRelation;
    private BigDecimal balance;
    private LocalDateTime createdAt;

    public AccountResponse(Account account) {
        this.id = account.getId();
        this.accountNumber = account.getAccountNumber();
        this.accountHolderName = account.getAccountHolderName();
        this.accountType = account.getAccountType();
        this.nid = account.getNid();
        this.fatherName = account.getFatherName();
        this.motherName = account.getMotherName();
        this.nomineeName = account.getNomineeName();
        this.nomineeNid = account.getNomineeNid();
        this.nomineeRelation = account.getNomineeRelation();
        this.balance = account.getBalance();
        this.createdAt = account.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public String getNid() {
        return nid;
    }

    public String getFatherName() {
        return fatherName;
    }

    public String getMotherName() {
        return motherName;
    }

    public String getNomineeName() {
        return nomineeName;
    }

    public String getNomineeNid() {
        return nomineeNid;
    }

    public String getNomineeRelation() {
        return nomineeRelation;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
