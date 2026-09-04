package org.example.persistence;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "Contact")
@Table(name = "contacts")
public class ContactDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long uuid;

    @Column(name = "account")
    private Long account;

    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    @Email
    @Column(unique = true)
    private String email;
    @Digits(integer = 15, fraction = 0)
    private String phoneNo;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "first_contact_id", referencedColumnName = "uuid")
    private List<ContactDetails> firstContactDetails = new ArrayList<>();
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "second_contact_id", referencedColumnName = "uuid")
    private List<ContactDetails> secondContactDetails = new ArrayList<>();
}
