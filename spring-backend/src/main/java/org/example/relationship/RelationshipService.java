package org.example.relationship;

import lombok.RequiredArgsConstructor;
import org.example.contact.ContactService;
import org.example.persistence.Relationship;
import org.example.persistence.RelationshipRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class RelationshipService {

    private final RelationshipRepository relationshipRepository;
    private final ContactService contactService;

    public List<Relationship> findAll() {
        return relationshipRepository.findAll();
    }

    public Relationship save(final Relationship toBeSaved) {
        return relationshipRepository.save(toBeSaved);
    }

    public void deleteById(String id) {
        relationshipRepository.deleteById(id);
    }

    public Optional<Relationship> findByUuid(String id) {
        return relationshipRepository.findById(id);
    }

    public List<Relationship> findByContactId(String id) {
        List<Relationship> result = new ArrayList<>();
        result.addAll(relationshipRepository.findByFirstContactId(id));
        result.addAll(relationshipRepository.findBySecondContactId(id));
        return result;
    }

    public List<Relationship> findByContactPair(String id, String secondId) {
        return relationshipRepository.findByFirstContactIdAndSecondContactId(id, secondId);
    }

    public boolean isRelationshipValid(Relationship relationship) {
        return contactService.findByUuid(relationship.getFirstContactId()).isPresent()
                && contactService.findByUuid(relationship.getSecondContactId()).isPresent();
    }
}
