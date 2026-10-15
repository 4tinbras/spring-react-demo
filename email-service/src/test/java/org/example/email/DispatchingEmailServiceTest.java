package org.example.email;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ActiveProfiles({"test", "send-mail"})
@SpringBootTest
class DispatchingEmailServiceTest {

    @MockitoBean
    private JavaMailSender mailSender;

    @Test
    void givenMessageShouldSendEmail() {
        DispatchingEmailService dispatchingEmailService = new DispatchingEmailService(mailSender);
        MimeMessage email = mailSender.createMimeMessage();

        dispatchingEmailService.processEmail(email);

        verify(mailSender, times(1)).send(eq(email));
    }

}