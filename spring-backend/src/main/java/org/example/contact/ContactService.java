package org.example.contact;

import lombok.extern.slf4j.Slf4j;
import org.example.persistence.ContactDetails;
import org.example.persistence.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ContactService {

    public static final String MESSAGE_PREFIX = "Inserting new contact with id ";

    private final MessagingService messagingService;
    private final ContactRepository contactRepository;

    public ContactService(final ContactRepository contactRepository,
                          final MessagingService messagingService) {
        this.contactRepository = contactRepository;
        this.messagingService = messagingService;
    }

    public List<ContactDetails> findAll() {
        return contactRepository.findAll();
    }

    public ContactDetails save(final ContactDetails toBeSaved) {
        messagingService.publishMessage(MESSAGE_PREFIX + toBeSaved.getUuid());

        final ContactDetails returnedRecord = contactRepository.save(toBeSaved);
        return returnedRecord;
    }

    public void deleteById(String id) {
        contactRepository.deleteById(id);
    }

    public ContactDetails findByEmail(String email) {
        return contactRepository.findByEmail(email);
    }

    public boolean validateRecordToSave(final ContactDetails contactDetails, final ContactDetails foundDetails) {
        if (contactDetails.getUuid() != null && !foundDetails.getUuid().equals(contactDetails.getUuid())) {
            log.error("Provided email is already associated with another account.");
            return false;
        }

        return true;
    }

}
