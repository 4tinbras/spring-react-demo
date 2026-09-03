package org.example.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<ContactDetails, String> {

    ContactDetails findByEmail(String email);

    List<ContactDetails> findByAccount(Long account);
}
