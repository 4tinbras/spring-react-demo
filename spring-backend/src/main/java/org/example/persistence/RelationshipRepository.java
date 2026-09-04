package org.example.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelationshipRepository extends JpaRepository<Relationship, String> {

    List<Relationship> findByFirstContactId(Long id);

    List<Relationship> findBySecondContactId(Long id);

    List<Relationship> findByFirstContactIdAndSecondContactId(Long id, Long secondId);
}
