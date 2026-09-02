package org.example.relationship;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.persistence.Relationship;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
public class RelationshipController {

    private final RelationshipService relationshipService;

    @GetMapping(path = "/relationships")
    public ResponseEntity<List<Relationship>> getAllRelationships(
            @Digits(integer = 19, fraction = 0) @RequestParam(value = "id", required = false) final String id,
            @Digits(integer = 19, fraction = 0) @RequestParam(value = "id", required = false) final String secondId) {
        final List<Relationship> result;
        if (id == null) {
            result = relationshipService.findAll();
        } else if (secondId == null) {
            result = relationshipService.findByContactId(id);
        } else {
            result = relationshipService.findByContactPair(id, secondId);
        }
        return new ResponseEntity<>(result, HttpStatusCode.valueOf(200));
    }

    //primary search
    @GetMapping(path = "/relationship/{id}")
    public ResponseEntity<Relationship> getRelationshipById(
            @NotBlank @Digits(integer = 19, fraction = 0) @PathVariable("id") final String id) {
        final Relationship result = relationshipService.findByUuid(id).get();
        return new ResponseEntity<>(result, HttpStatusCode.valueOf(200));
    }

    @PostMapping(path = "/relationship")
    public ResponseEntity<Relationship> createRelationship(@Valid @RequestBody final Relationship relationship) {
        boolean isValid = relationshipService.isRelationshipValid(relationship);
        if (isValid) {
            final Relationship result = relationshipService.save(relationship);
            return new ResponseEntity<>(result, HttpStatusCode.valueOf(201));
        } else {
            return new ResponseEntity<>(HttpStatusCode.valueOf(400));
        }
    }


    @DeleteMapping(path = "/relationship/{id}")
    public ResponseEntity<List<Relationship>> removeRelationshipById(
            @NotBlank @Digits(integer = 19, fraction = 0) @PathVariable("id") final String id) {
        relationshipService.deleteById(id);
        return new ResponseEntity<>(HttpStatusCode.valueOf(204));
    }
}
