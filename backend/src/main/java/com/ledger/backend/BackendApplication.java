package com.ledger.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point of the Mini Transaction Ledger backend service.
 *
 * This application exposes a REST API that lets a client:
 *  - create accounts
 *  - record debit / credit transactions against an account
 *  - view a running balance history (the "ledger") for an account
 */
@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
