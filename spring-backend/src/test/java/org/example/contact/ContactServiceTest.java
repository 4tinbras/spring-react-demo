package org.example.contact;

import org.example.messaging.MessagingService;
import org.example.persistence.Account;
import org.example.persistence.ContactDetails;
import org.example.persistence.ContactRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static org.example.contact.ContactService.MESSAGE_PREFIX;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;


class ContactServiceTest {

    //JPA makes those classes awfully circularly referenced
    private final Account stubAccount = new Account(1L, "John", "DOe", List.of(
            new ContactDetails(1L, null, "Tom", "Smith", "ts1@example.com", "1234567890")
    ), Account.AccountType.END_USER, Account.AccountState.OK);
    private final ContactDetails validRecord = new ContactDetails(1L, stubAccount, "Tom", "Smith", "ts1@example.com", "1234567890");
    private MessagingService messagingService;
    private ContactRepository contactRepository;
    private ContactService subject;

    @BeforeEach
    void setup() {
        messagingService = Mockito.mock(MessagingService.class);
        contactRepository = Mockito.mock(ContactRepository.class);

        when(contactRepository.save(eq(validRecord))).thenReturn(validRecord);

        subject = new ContactService(messagingService, contactRepository);
    }

    @Test
    void whenSaveWithValidRecord_thenMessageEmitted_andSavedRecordReturned() {
        ContactDetails outcome = subject.save(validRecord);
        assertEquals(validRecord, outcome);

        verify(messagingService, times(1)).publishMessage(eq(MESSAGE_PREFIX + validRecord.getUuid()));
    }

    @Test
    void whenDeleteOneOfManyDetails_thenReturnTrue() {

        when(contactRepository.findById(eq("1"))).thenReturn(Optional.of(validRecord));
        when(contactRepository.findByAccount(1L)).thenReturn(List.of(validRecord, validRecord));

        assertTrue(subject.canRemoveContactDetails("1"));
    }

    @Test
    void whenSaveWithDuplicateEmail_thenReturnValidIsFalse() {
        ContactDetails duplicateEmailRecord = new ContactDetails(99L, stubAccount, "Tom", "Smith", "ts1@example.com", "1234567890");

        assertFalse(subject.validateRecordToSave(duplicateEmailRecord, validRecord));
    }

    @Test
    void whenSaveWithNoAccountRef_thenReturnValidIsFalse() {
        ContactDetails noAccountRecord = new ContactDetails(1L, null, "Tom", "Smith", "ts1@example.com", "1234567890");
        assertFalse(subject.validateRecordToSave(noAccountRecord, validRecord));
    }

    @Test
    void whenSaveWithInvalidAccountRef_thenReturnValidIsFalse() {
        when(contactRepository.findById(eq("1"))).thenReturn(Optional.empty());

        ContactDetails invalidAccountRecord = new ContactDetails(1L, stubAccount, "Tom", "Smith", "ts1@example.com", "1234567890");
        assertFalse(subject.validateRecordToSave(invalidAccountRecord, validRecord));
    }

    @Test
    void whenRemoveLastContacts_thenReturnFalse() {
        when(contactRepository.findById(eq("1"))).thenReturn(Optional.of(validRecord));
        when(contactRepository.findByAccount(1L)).thenReturn(List.of(validRecord));

        assertFalse(subject.canRemoveContactDetails("1"));
    }

}