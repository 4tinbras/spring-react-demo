package org.example.persistence;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "contacts")
public class ContactDetails {

    //TODO: change to a proper UUID
    @Id
    @GeneratedValue
    private Long uuid;

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNo;

}
