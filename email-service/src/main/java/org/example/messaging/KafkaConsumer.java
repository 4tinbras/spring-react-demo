package org.example.messaging;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.Getter;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.example.email.EmailProducer;
import org.example.email.EmailService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.stereotype.Component;

@Getter
@Component
public class KafkaConsumer implements MessagingConsumer {

    public static final String DEFAULT_TOPIC = "spreact-emails-out";

    private final Consumer<String, String> consumer;

    private final EmailService emailService;
    private final EmailProducer emailProducer;
    private String payload;

    public KafkaConsumer(ConsumerFactory<String, String> kafkaConsumerFactory,
                         EmailService emailService, EmailProducer emailProducer) {
        this.consumer = kafkaConsumerFactory.createConsumer();
        this.emailService = emailService;
        this.emailProducer = emailProducer;
    }

    @KafkaListener(id = "email-listener", topics = {KafkaConsumer.DEFAULT_TOPIC}, groupId = "spreact")
    public void processEmailEvent(ConsumerRecord<?, ?> consumerRecord) throws MessagingException {
        System.out.println("Received Message in default topic: " + consumerRecord.value());
        payload = (String) consumerRecord.value();

        MimeMessage email = emailProducer.produceHtmlEmail(payload);
        emailService.processEmail(email);
    }

}
