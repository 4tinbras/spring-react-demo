package org.example.persistence;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
    // TODO: replace with proper JPA link
    @NotBlank
    private String firstContactId;
    @NotBlank
    private String secondContactId;
    @NotNull
    private RelationshipType relationshipType;

    public enum RelationshipType {
        UNKNOWN,
        FIRST_FOLLOWS_SECOND,
        SECOND_FOLLOWS_FIRST,
        FRIENDS
    }
}
