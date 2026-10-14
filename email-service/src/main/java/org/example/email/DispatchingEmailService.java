package org.example.email;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Primary
@Profile("send-email")
@RequiredArgsConstructor
@Service
public class DispatchingEmailService implements EmailService {
    private final JavaMailSender mailSender;

    @Override
    public void processEmail(MimeMessage email) {
        this.mailSender.send(email);
    }
}
