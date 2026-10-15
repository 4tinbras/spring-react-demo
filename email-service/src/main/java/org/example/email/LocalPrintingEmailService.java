package org.example.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Saves locally produced html email file
 */
@RequiredArgsConstructor
@Service
public class LocalPrintingEmailService implements EmailService {

    @Value("${services.email.file.folder}")
    private String saveEmailDestinationPrefix;
    @Value("${services.email.file.name}")
    private String saveEmailFileName;


    @Override
    public void processEmail(MimeMessage email) {
        File file = new File(saveEmailDestinationPrefix + saveEmailFileName);

        try (PrintWriter out = new PrintWriter(file)) {
            out.print(new String(email.getInputStream().readAllBytes()));
            out.flush();
        } catch (IOException | MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}
