package org.example.contact;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.persistence.ContactDetails;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
public class ContactController {

    private final ContactService contactService;


    @GetMapping(path="/contacts")
    public ResponseEntity<List<ContactDetails>> getContacts() {
        List<ContactDetails> contacts = contactService.findAll();
        return new ResponseEntity<>(contacts, HttpStatusCode.valueOf(200));
    }

    @PostMapping(path="/contact")
    public ResponseEntity<ContactDetails> updateContact(@Valid @RequestBody ContactDetails contactDetails)
            throws URISyntaxException {
        //TODO: add testing
        ContactDetails foundDetails = contactService.findByEmail(contactDetails.getEmail());
        ContactDetails savedContact;
        if (foundDetails != null) {
            if (contactDetails.getUuid() != null && !foundDetails.getUuid().equals(contactDetails.getUuid())) {
                log.error("Provided email is already associated with another account.");
                return new ResponseEntity<>(HttpStatusCode.valueOf(422));
            }
            contactDetails.setUuid(foundDetails.getUuid());
            savedContact = contactService.save(contactDetails);
        }

        savedContact = contactService.save(contactDetails);
        log.debug("Updated contact with id: {}", savedContact.getUuid());
        return ResponseEntity.created(new URI("/contacts/" + savedContact.getUuid())).body(savedContact);
    }

    @DeleteMapping(path="/contact/{id}")
    public ResponseEntity<ContactDetails> deleteContact(@NotBlank @Digits(integer = 19, fraction = 0) @PathVariable("id") String id) {
        contactService.deleteById(id);
        return new ResponseEntity<>(HttpStatusCode.valueOf(204));
    }
}
