package org.example.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelationshipRepository extends JpaRepository<Relationship, String> {

    List<Relationship> findByFirstContactId(String id);

    List<Relationship> findBySecondContactId(String id);

    List<Relationship> findByFirstContactIdAndSecondContactId(String id, String secondId);
}
