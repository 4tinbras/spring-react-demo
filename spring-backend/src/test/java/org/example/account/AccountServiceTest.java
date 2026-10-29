package org.example.account;

import org.example.contact.ContactService;
import org.example.persistence.Account;
import org.example.persistence.AccountDTO;
import org.example.persistence.AccountRepository;
import org.example.persistence.ContactDetails;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class AccountServiceTest {

    private static final String AUDIT_SERVICE_URL = "http://localhost:7070";
    private static final String SECURITY_SERVICE_URL = "http://localhost:6060";
    private final ContactDetails VALID_CONTACT = new ContactDetails(
            1L, 1L, "firstName", "surname",
            "sample@example.com", "0685773921", List.of(), List.of());

    @Test
    void givenValidAccountWithoutStatusChanges_whenSave_thenNoAdditionalActions_andReturnUpdatedAccount() {
        Account currentAccountState = new Account(1L, "firstName", "surname", List.of(VALID_CONTACT),
                Account.AccountType.END_USER, Account.AccountState.OK);
        Account accountToBeSaved = new Account(1L, "changedName", "changedSurname", List.of(VALID_CONTACT),
                Account.AccountType.END_USER, Account.AccountState.OK);

        ContactService contactService = Mockito.mock(ContactService.class);
        AccountRepository accountRepository = Mockito.mock(AccountRepository.class);
        when(accountRepository.findById("1")).thenReturn(Optional.of(currentAccountState));
        when(accountRepository.save(eq(accountToBeSaved))).thenReturn(accountToBeSaved);
        RestClient restClient = Mockito.mock(RestClient.class);

        AccountService subject = new AccountService(accountRepository, contactService, restClient, AUDIT_SERVICE_URL, SECURITY_SERVICE_URL);

        subject.save(accountToBeSaved);

        verify(accountRepository).save(eq(accountToBeSaved));
        verify(restClient, never()).post();
    }

    @Test
    void givenValidAccountWithChangedStatus_whenSave_thenPerformNecessaryActions_andReturnUpdatedAccount() {

        Account currentAccountState = new Account(1L, "firstName", "surname", List.of(VALID_CONTACT),
                Account.AccountType.END_USER, Account.AccountState.OK);
        Account accountToBeSaved = new Account(1L, "firstName", "surname", List.of(VALID_CONTACT),
                Account.AccountType.END_USER, Account.AccountState.FROZEN);

        ContactService contactService = Mockito.mock(ContactService.class);

        AccountRepository accountRepository = Mockito.mock(AccountRepository.class);
        when(accountRepository.findById("1")).thenReturn(Optional.of(currentAccountState));
        when(accountRepository.save(eq(accountToBeSaved))).thenReturn(accountToBeSaved);

        RestClient restClient = Mockito.mock(RestClient.class);
        RestClient.RequestBodyUriSpec partialRequest1 = Mockito.mock(RestClient.RequestBodyUriSpec.class);
        RestClient.RequestBodySpec partialRequest2 = Mockito.mock(RestClient.RequestBodySpec.class);
        when(restClient.post()).thenReturn(partialRequest1);
        when(partialRequest1.uri(eq(AUDIT_SERVICE_URL))).thenReturn(partialRequest2);
        when(partialRequest1.uri(eq(SECURITY_SERVICE_URL))).thenReturn(partialRequest2);
        when(partialRequest2.body(any())).thenReturn(partialRequest2);
        AccountService subject = new AccountService(accountRepository, contactService, restClient, AUDIT_SERVICE_URL, SECURITY_SERVICE_URL);

        Account outcome = subject.save(accountToBeSaved);
        assertEquals(accountToBeSaved, outcome);

        ArgumentCaptor<String> urlCaptor = ArgumentCaptor.forClass(String.class);

        verify(restClient, times(2)).post();
        verify(partialRequest1, times(2)).uri(urlCaptor.capture());
        verify(partialRequest2, times(2)).retrieve();
        verify(accountRepository).save(eq(accountToBeSaved));

        List<String> capturedUrls = urlCaptor.getAllValues();

        assertTrue(capturedUrls.contains(SECURITY_SERVICE_URL));
        assertTrue(capturedUrls.contains(AUDIT_SERVICE_URL));
    }

    @Test
    void givenValidDTO_whenConvertToAccount_validAccountCreated() {
        AccountDTO accountDTO = new AccountDTO(
                1L, "firstName", "surname", List.of("1", "2"),
                Account.AccountType.END_USER, Account.AccountState.OK);

        ContactDetails firstContactDetails = new ContactDetails(
                1L, 1L, "firstName", "surname",
                "sample@example.com", "0685773921", List.of(), List.of());

        ContactDetails secondContactDetails = new ContactDetails(
                2L, 1L, "firstName", "surname",
                "sample2@example.com", "0685773921", List.of(), List.of());

        ContactService contactService = Mockito.mock(ContactService.class);
        when(contactService.findByUuid("1")).thenReturn(Optional.of(firstContactDetails));
        when(contactService.findByUuid("2")).thenReturn(Optional.of(secondContactDetails));
        RestClient restClient = Mockito.mock(RestClient.class);
        AccountService subject = new AccountService(null, contactService, restClient, null, null);

        Account outcome = subject.convertDtoToAccount(accountDTO);

        assertEquals(accountDTO.getContactDetails().size(), outcome.getContactDetails().size());
        assertEquals(accountDTO.getContactDetails().get(0), outcome.getContactDetails().get(0).getUuid().toString());
        assertEquals(accountDTO.getContactDetails().get(1), outcome.getContactDetails().get(1).getUuid().toString());
    }
}