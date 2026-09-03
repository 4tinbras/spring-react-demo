package org.example.account;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.persistence.Account;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
public class AccountController {

    private final AccountService accountService;

    @GetMapping(path = "/accounts")
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountService.findAll());
    }

    @GetMapping(path = "/account/{id}")
    public ResponseEntity<Account> getAccountById(
            @NotBlank @Digits(integer = 19, fraction = 0) @PathVariable("id") final String id) {
        return ResponseEntity.ok(accountService.findByUuid(id).get());
    }

    @PostMapping(path = "/account")
    public ResponseEntity<Account> createAccount(@Valid @RequestBody final Account account) {
        Account result = accountService.save(account);
        return new ResponseEntity<>(result, HttpStatusCode.valueOf(201));
    }

    //on a purpose there is no PUT, it could break things way too easily

    // TODO: validate by hand only what is provided instead of auto-validating everything
    @PatchMapping(path = "/account")
    public ResponseEntity<Account> patchAccount(@RequestBody final Account account) {
        // if includes contactdetails ensure that it is valid
        return null;
    }

    @DeleteMapping(path = "/account/{id}")
    public ResponseEntity<Void> removeAccount(@NotBlank @Digits(integer = 19, fraction = 0) @PathVariable("id") final String id) {
        // TODO: ensure that all contacts tied to the account are cleaned up as well
        accountService.deleteById(id);
        return new ResponseEntity<>(HttpStatusCode.valueOf(204));
    }
}
