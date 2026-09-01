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
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
public class ContactController {

    private final ContactService contactService;


    @GetMapping(path="/contacts")
    public ResponseEntity<List<ContactDetails>> getContacts() {
        final List<ContactDetails> contacts = contactService.findAll();
        return new ResponseEntity<>(contacts, HttpStatusCode.valueOf(200));
    }

    @GetMapping(path = "/contact/{id}")
    public ResponseEntity<ContactDetails> getContact(@NotBlank @Digits(integer = 19, fraction = 0) @PathVariable("id") final String id) {
        final Optional<ContactDetails> contact = contactService.findByUuid(id);
        return new ResponseEntity<>(contact.get(), HttpStatusCode.valueOf(200));
    }

    // TODO: there is a bug around inserting first new record when identical one is already present
    @PostMapping(path="/contact")
    public ResponseEntity<ContactDetails> updateContact(@Valid @RequestBody final ContactDetails contactDetails)
            throws URISyntaxException {
        final ContactDetails foundDetails = contactService.findByEmail(contactDetails.getEmail());
        if (foundDetails != null) {
            if (!contactService.validateRecordToSave(contactDetails, foundDetails)) {
                return new ResponseEntity<>(HttpStatusCode.valueOf(422));
            }
            contactDetails.setUuid(foundDetails.getUuid());
        }

        final ContactDetails savedContact = contactService.save(contactDetails);
        log.debug("Updated contact with id: {}", savedContact.getUuid());
        return ResponseEntity.created(new URI("/contacts/" + savedContact.getUuid())).body(savedContact);
    }

    //on a purpose there is no PUT, it could break things way too easily

    // TODO: add patch; mind that link to account needs special handling

    @DeleteMapping(path="/contact/{id}")
    public ResponseEntity<Void> deleteContact(@NotBlank @Digits(integer = 19, fraction = 0) @PathVariable("id") final String id) {
        if (!contactService.canRemoveContactDetails(id)) {
            return new ResponseEntity<>(HttpStatusCode.valueOf(400));
        }

        contactService.deleteById(id);
        return new ResponseEntity<>(HttpStatusCode.valueOf(204));
    }
}
