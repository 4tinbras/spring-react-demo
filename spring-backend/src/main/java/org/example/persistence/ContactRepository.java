package org.example.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<ContactDetails, String> {

    ContactDetails findByEmail(String email);
}
