package com.ledger.backend.service;

import com.ledger.backend.dto.AccountRequest;
import com.ledger.backend.dto.AccountResponse;
import com.ledger.backend.entity.Account;
import com.ledger.backend.entity.AccountType;
import com.ledger.backend.exception.ResourceNotFoundException;
import com.ledger.backend.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    /**
     * Creates a new account. The account number is never supplied by the
     * client - it is generated here and guaranteed unique across the whole
     * system before the account is persisted.
     */
    public AccountResponse createAccount(AccountRequest request) {
        if (accountRepository.existsByNid(request.getNid())) {
            throw new IllegalArgumentException(
                    "An account already exists for NID '" + request.getNid() + "'");
        }

        Account account = new Account(
                request.getAccountHolderName(),
                request.getAccountType(),
                request.getNid(),
                request.getFatherName(),
                request.getMotherName(),
                request.getNomineeName(),
                request.getNomineeNid(),
                request.getNomineeRelation()
        );
        account.setAccountNumber(generateUniqueAccountNumber(request.getAccountType()));

        Account saved = accountRepository.save(account);
        return new AccountResponse(saved);
    }

    /**
     * Builds an account number like "SAV-2026-483920" (type prefix + year +
     * 6 random digits) and keeps regenerating on the rare chance of a
     * collision until it finds one that does not exist yet - so every
     * account number is unique system-wide.
     */
    private String generateUniqueAccountNumber(AccountType type) {
        String prefix = switch (type) {
            case SAVINGS -> "SAV";
            case CURRENT -> "CUR";
            case BUSINESS -> "BUS";
        };
        int year = java.time.Year.now().getValue();

        String candidate;
        do {
            int randomDigits = 100000 + RANDOM.nextInt(900000); // 6-digit random number
            candidate = prefix + "-" + year + "-" + randomDigits;
        } while (accountRepository.existsByAccountNumber(candidate));

        return candidate;
    }

    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(AccountResponse::new)
                .collect(Collectors.toList());
    }

    public AccountResponse getAccountById(Long id) {
        Account account = findAccountOrThrow(id);
        return new AccountResponse(account);
    }


    Account findAccountOrThrow(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
    }

    Account save(Account account) {
        return accountRepository.save(account);
    }
}
