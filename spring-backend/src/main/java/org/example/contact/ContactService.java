package org.example.contact;

import org.example.persistence.ContactDetails;
import org.example.persistence.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<ContactDetails> findAll() {
        return contactRepository.findAll();
    }

    public ContactDetails save(ContactDetails toBeSaved) {
        return contactRepository.save(toBeSaved);
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
