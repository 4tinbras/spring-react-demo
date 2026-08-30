package org.example.persistence;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "Account")
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long uuid;

    private String ownersFirstName;
    private String ownersSurname;


    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContactDetails> contactDetails = new ArrayList<>();

    private AccountType accountType;
    private AccountState accountState;

    public enum AccountType {
        END_USER,
        ADMINISTRATOR
    }

    public enum AccountState {
        NEEDS_NEW_PASSWORD,
        OK,
        FROZEN,
        BLOCKED,
        INACTIVE

    }
}
