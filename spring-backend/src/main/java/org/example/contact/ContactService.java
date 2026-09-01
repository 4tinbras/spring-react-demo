package org.example.contact;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.messaging.MessagingService;
import org.example.persistence.ContactDetails;
import org.example.persistence.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class ContactService {

    public static final String MESSAGE_PREFIX = "Inserting new contact with id ";

    private final MessagingService messagingService;
    private final ContactRepository contactRepository;

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

    public Optional<ContactDetails> findByUuid(String uuid) {
        return contactRepository.findById(uuid);
    }

    public boolean validateRecordToSave(final ContactDetails contactDetails, final ContactDetails foundDetails) {
        // check if there is a linked account or the record would be an orphan
        if (contactDetails.getAccount() == null) {
            log.error("Details are not linked to a valid account");
            return false;
        }

        if (findByUuid(contactDetails.getAccount().getUuid().toString()).equals(Optional.empty())) {
            log.error("Details are not linked to a valid account");
            return false;
        }

        if (contactDetails.getUuid() != null && !foundDetails.getUuid().equals(contactDetails.getUuid())) {
            log.error("Provided email is already associated with another account.");
            return false;
        }

        return true;
    }

    public boolean canRemoveContactDetails(String id) {
        ContactDetails affectedContact = findByUuid(id).get();
        List<ContactDetails> affectedDetails = contactRepository.findByAccount(affectedContact.getAccount().getUuid());

        return affectedDetails.size() > 1;
    }

}
