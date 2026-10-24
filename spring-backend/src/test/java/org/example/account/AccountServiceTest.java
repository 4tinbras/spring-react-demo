package org.example.account;

import org.example.contact.ContactService;
import org.example.persistence.Account;
import org.example.persistence.AccountDTO;
import org.example.persistence.ContactDetails;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class AccountServiceTest {


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
        AccountService subject = new AccountService(null, contactService);

        Account outcome = subject.convertDtoToAccount(accountDTO);

        assertEquals(accountDTO.getContactDetails().size(), outcome.getContactDetails().size());
        assertEquals(accountDTO.getContactDetails().get(0), outcome.getContactDetails().get(0).getUuid().toString());
        assertEquals(accountDTO.getContactDetails().get(1), outcome.getContactDetails().get(1).getUuid().toString());
    }
}