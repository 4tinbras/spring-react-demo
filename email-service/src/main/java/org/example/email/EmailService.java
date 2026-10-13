package org.example.email;

import jakarta.mail.internet.MimeMessage;

public interface EmailService {

    void processEmail(MimeMessage email);
}
