package org.example.persistence;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {

    private Long uuid;

    private String ownersFirstName;
    private String ownersSurname;

    private List<String> contactDetails = new ArrayList<>();

    private Account.AccountType accountType;
    private Account.AccountState accountState;


}