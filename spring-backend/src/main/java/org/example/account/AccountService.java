package org.example.account;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.persistence.Account;
import org.example.persistence.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    public Account save(final Account toBeSaved) {
        return accountRepository.save(toBeSaved);
    }

    public void deleteById(String id) {
        accountRepository.deleteById(id);
    }

    public Optional<Account> findByUuid(String uuid) {
        return accountRepository.findById(uuid);
    }
}
