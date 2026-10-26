package org.example.account;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.contact.ContactService;
import org.example.persistence.Account;
import org.example.persistence.AccountDTO;
import org.example.persistence.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final ContactService contactService;

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

    public Account convertDtoToAccount(AccountDTO accountDTO) {
        Account account = new Account();
        account.setUuid(accountDTO.getUuid());
        account.setAccountState(accountDTO.getAccountState());
        account.setAccountType(accountDTO.getAccountType());
        account.setOwnersFirstName(accountDTO.getOwnersFirstName());
        account.setOwnersSurname(accountDTO.getOwnersSurname());

        account.setContactDetails(new ArrayList<>());
        for (String contactUUID : accountDTO.getContactDetails()) {
            account.getContactDetails()
                    .add(contactService.findByUuid(contactUUID)
                            .orElseThrow(IllegalArgumentException::new));
        }

        return account;
    }
}
