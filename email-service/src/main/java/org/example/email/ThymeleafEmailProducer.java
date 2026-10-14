package org.example.email;

import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.ZonedDateTime;
import java.util.Locale;
import java.util.Properties;

@RequiredArgsConstructor
@Service
public class ThymeleafEmailProducer implements EmailProducer {
    private final TemplateEngine templateEngine;

    @Override
    public MimeMessage produceHtmlEmail(String emailInfo) throws MessagingException {
        final Context ctx = new Context(Locale.UK);
        ctx.setVariable("subscriptionDate", ZonedDateTime.now());
        ctx.setVariable("name", "Joe Doe");

        final MimeMessage mimeMessage = new MimeMessage(Session.getDefaultInstance(new Properties()));
        final MimeMessageHelper message =
                new MimeMessageHelper(mimeMessage, true, "UTF-8");
        message.setSubject("Example HTML email");
        message.setFrom("email@example.com");
        message.setTo(emailInfo);

        final String htmlContent = this.templateEngine.process("update-email.html", ctx);
        message.setText(htmlContent, true);

        return mimeMessage;
    }
}
