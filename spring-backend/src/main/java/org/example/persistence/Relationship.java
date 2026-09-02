package org.example.persistence;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@EqualsAndHashCode
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "relationships")
public class Relationship {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long uuid;
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "first_contact_id")
    private ContactDetails firstContactId;
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "second_contact_id")
    private ContactDetails secondContactId;
    @NotNull
    private RelationshipType relationshipType;

    public enum RelationshipType {
        UNKNOWN,
        FIRST_FOLLOWS_SECOND,
        SECOND_FOLLOWS_FIRST,
        FRIENDS
    }
}
