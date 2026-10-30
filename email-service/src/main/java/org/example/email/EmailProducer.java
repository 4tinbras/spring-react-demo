package org.example.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.example.messaging.EmailServiceCommand;

public interface EmailProducer {

    MimeMessage produceHtmlEmail(EmailServiceCommand emailInfo) throws MessagingException;
}
