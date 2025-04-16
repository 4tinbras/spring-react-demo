package org.example.contact;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.persistence.ContactDetails;
import org.example.persistence.ContactRepository;
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
    public ResponseEntity<ContactDetails> createContact(@RequestBody ContactDetails contactDetails) throws URISyntaxException {
        ContactDetails savedContact = contactService.save(contactDetails);
        log.debug("added contact with id: {}", savedContact.getUuid());
        return ResponseEntity.created(new URI("/contacts/" + savedContact.getUuid())).body(savedContact);
    }

    @DeleteMapping(path="/contact/{id}")
    public ResponseEntity<ContactDetails> deleteContact(@PathVariable("id") String id) {
        contactService.deleteById(id);
        return new ResponseEntity<>(HttpStatusCode.valueOf(204));
    }
}
