package org.example.messaging;


public record EmailServiceCommand(String recipientsEmail, String recipientsName, String typeOfUpdate) {
    //No implementation so that it got its default hash and equals functions
}