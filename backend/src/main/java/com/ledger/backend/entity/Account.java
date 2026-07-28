package com.ledger.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a single ledger account (e.g. "Cash", "Rahim's Wallet").
 *
 * The account itself does NOT store the balance directly as a mutable field
 * that gets overwritten - instead the balance is persisted as a snapshot
 * ({@link #balance}) that is recalculated every time a new transaction is
 * posted by {@code TransactionService}. This mirrors how a real ledger
 * works: the balance is always "the sum of all entries so far".
 */
@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String accountNumber;

    @Column(nullable = false, length = 100)
    private String accountHolderName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AccountType accountType;

    @Column(nullable = false, unique = true, length = 30)
    private String nid;

    @Column(nullable = false, length = 100)
    private String fatherName;

    @Column(nullable = false, length = 100)
    private String motherName;

    @Column(nullable = false, length = 100)
    private String nomineeName;

    @Column(nullable = false, length = 30)
    private String nomineeNid;

    @Column(length = 50)
    private String nomineeRelation;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();

    public Account() {
    }

    /**
     * Note: accountNumber is intentionally left null here - AccountService
     * generates a unique number right after constructing this object, before
     * it is ever saved (see AccountService#createAccount).
     */
    public Account(String accountHolderName, AccountType accountType, String nid,
                   String fatherName, String motherName,
                   String nomineeName, String nomineeNid, String nomineeRelation) {
        this.accountHolderName = accountHolderName;
        this.accountType = accountType;
        this.nid = nid;
        this.fatherName = fatherName;
        this.motherName = motherName;
        this.nomineeName = nomineeName;
        this.nomineeNid = nomineeNid;
        this.nomineeRelation = nomineeRelation;
        this.balance = BigDecimal.ZERO;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ---- Getters & Setters ----

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public void setAccountHolderName(String accountHolderName) {
        this.accountHolderName = accountHolderName;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public String getNid() {
        return nid;
    }

    public void setNid(String nid) {
        this.nid = nid;
    }

    public String getFatherName() {
        return fatherName;
    }

    public void setFatherName(String fatherName) {
        this.fatherName = fatherName;
    }

    public String getMotherName() {
        return motherName;
    }

    public void setMotherName(String motherName) {
        this.motherName = motherName;
    }

    public String getNomineeName() {
        return nomineeName;
    }

    public void setNomineeName(String nomineeName) {
        this.nomineeName = nomineeName;
    }

    public String getNomineeNid() {
        return nomineeNid;
    }

    public void setNomineeNid(String nomineeNid) {
        this.nomineeNid = nomineeNid;
    }

    public String getNomineeRelation() {
        return nomineeRelation;
    }

    public void setNomineeRelation(String nomineeRelation) {
        this.nomineeRelation = nomineeRelation;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }
}
