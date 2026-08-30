package org.example.persistence;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "ContactDetails")
@Table(name = "contact_details")
public class ContactDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long uuid;
    @ManyToOne(fetch = FetchType.LAZY)
    private Account account;

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

}
