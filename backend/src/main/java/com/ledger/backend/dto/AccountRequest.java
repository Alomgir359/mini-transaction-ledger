package com.ledger.backend.dto;

import com.ledger.backend.entity.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 * Payload sent by the client to create a new account.
 *
 * Note: the account number is NOT supplied by the client - it is generated
 * automatically and guaranteed unique by the backend (see AccountService).
 */
public class AccountRequest {

    @NotBlank(message = "accountHolderName is required")
    private String accountHolderName;

    @NotNull(message = "accountType is required")
    private AccountType accountType;

    @NotBlank(message = "nid is required")
    @Pattern(regexp = "\\d{10}|\\d{13}|\\d{17}", message = "nid must be a valid 10, 13, or 17 digit NID number")
    private String nid;

    @NotBlank(message = "fatherName is required")
    private String fatherName;

    @NotBlank(message = "motherName is required")
    private String motherName;

    @NotBlank(message = "nomineeName is required")
    private String nomineeName;

    @NotBlank(message = "nomineeNid is required")
    @Pattern(regexp = "\\d{10}|\\d{13}|\\d{17}", message = "nomineeNid must be a valid 10, 13, or 17 digit NID number")
    private String nomineeNid;

    private String nomineeRelation;

    public AccountRequest() {
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
}
