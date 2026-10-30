package org.example.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.example.messaging.EmailCommandType;
import org.example.messaging.EmailServiceCommand;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.thymeleaf.TemplateEngine;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ActiveProfiles({"test"})
@SpringBootTest
class ThymeleafEmailProducerTest {

    @Autowired
    TemplateEngine templateEngine;

    @Test
    void givenEmailAddress_whenProduceEmail_thenGenerateEmailWithCorrectAddressee() throws MessagingException {
        EmailServiceCommand input = new EmailServiceCommand("email@example.com", "Tom", EmailCommandType.CONTACT_UPDATED);
        ThymeleafEmailProducer subject = new ThymeleafEmailProducer(templateEngine);

        MimeMessage outcome = subject.produceHtmlEmail(input);

        assertEquals("email@example.com", outcome.getFrom()[0].toString());
        assertEquals(input.recipientsEmail(), outcome.getAllRecipients()[0].toString());
    }
}