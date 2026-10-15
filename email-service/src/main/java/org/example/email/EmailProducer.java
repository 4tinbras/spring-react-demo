package org.example.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

public interface EmailProducer {

    MimeMessage produceHtmlEmail(String emailInfo) throws MessagingException;
}
