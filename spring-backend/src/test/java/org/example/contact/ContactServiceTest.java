package org.example.contact;

import org.example.messaging.MessagingService;
import org.example.persistence.ContactDetails;
import org.example.persistence.ContactRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.example.contact.ContactService.MESSAGE_PREFIX;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;


class ContactServiceTest {

    private final ContactDetails validRecord = new ContactDetails(1L, "Tom", "Smith", "ts1@example.com", "1234567890");
    private final ContactDetails duplicateRecord = new ContactDetails(22L, "Secundus", "Smith", "ts1@example.com", "1234567890");
    private MessagingService messagingService;
    private ContactRepository contactRepository;
    private ContactService subject;

    @BeforeEach
    void setup() {
        messagingService = Mockito.mock(MessagingService.class);
        contactRepository = Mockito.mock(ContactRepository.class);

        when(contactRepository.save(eq(validRecord))).thenReturn(validRecord);

        subject = new ContactService(contactRepository, messagingService);
    }

    @Test
    void whenSaveWithValidRecord_thenMessageEmitted_andSavedRecordReturned() {
        ContactDetails outcome = subject.save(validRecord);
        assertEquals(validRecord, outcome);

        verify(messagingService, times(1)).publishMessage(eq(MESSAGE_PREFIX + validRecord.getUuid()));
    }

    @Test
    void whenValidateWithDistinctUUID_thenReturnFalse() {
        assertFalse(subject.validateRecordToSave(duplicateRecord, validRecord));
    }

    @Test
    void whenValidateWithValidUUID_thenReturnFalse() {
        assertTrue(subject.validateRecordToSave(validRecord, validRecord));
    }

}