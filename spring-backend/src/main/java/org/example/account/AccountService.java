package org.example.account;

import lombok.extern.slf4j.Slf4j;
import org.example.contact.ContactService;
import org.example.messaging.EmailCommandType;
import org.example.messaging.EmailServiceCommand;
import org.example.messaging.MessagingService;
import org.example.persistence.Account;
import org.example.persistence.AccountDTO;
import org.example.persistence.AccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final ContactService contactService;
    private final String auditServiceUrl;
    private final String securityServiceUrl;
    private final RestClient restClient;
    private final MessagingService messagingService;

    public AccountService(AccountRepository accountRepository, ContactService contactService, RestClient restClient,
                          MessagingService messagingService,
                          @Value("${services.account.audit-service-url}") String auditServiceUrl,
                          @Value("${services.account.security-service-url}") String securityServiceUrl) {
        this.accountRepository = accountRepository;
        this.contactService = contactService;
        this.restClient = restClient;
        this.auditServiceUrl = auditServiceUrl;
        this.securityServiceUrl = securityServiceUrl;
        this.messagingService = messagingService;
    }

    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    public Account save(final Account toBeSaved) {
        //get original
        if (toBeSaved.getUuid() != null) {
            Account original = findByUuid(String.valueOf(toBeSaved.getUuid())).get();

            //if account type or state has changed - perform additional actions
            if (original.getAccountState() != toBeSaved.getAccountState()
                    || original.getAccountType() != toBeSaved.getAccountType()) {

                try {
                    //check with stub security app
                    RestClient.ResponseSpec securityResponse = restClient.post()
                            .uri(securityServiceUrl + "/account/update/" + toBeSaved.getUuid())
                            .retrieve();
                    // save to audit trail via audit service
                    RestClient.ResponseSpec auditResponse = restClient.post()
                            .uri(auditServiceUrl + "/account/update/" + toBeSaved.getUuid())
                            .retrieve();
                } catch (RestClientResponseException exception) {
                    exception.printStackTrace();
                }
            }
        }
        messagingService.publishMessage(new EmailServiceCommand(toBeSaved.getContactDetails().getFirst().getEmail(), toBeSaved.getOwnersFirstName(),
                toBeSaved.getUuid() == null ? EmailCommandType.CONTACT_CREATED : EmailCommandType.CONTACT_UPDATED));

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
