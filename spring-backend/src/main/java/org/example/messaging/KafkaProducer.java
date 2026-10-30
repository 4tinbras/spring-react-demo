package org.example.messaging;

import org.springframework.context.annotation.Profile;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.stereotype.Service;

@Profile("kafka-msg")
@Service
public class KafkaProducer implements MessagingService {

    public static final String DEFAULT_TOPIC = "spreact-emails-out";
    private final KafkaTemplate<String, EmailServiceCommand> template;

    public KafkaProducer(ProducerFactory<String, EmailServiceCommand> kafkaProducerFactory) {
        this.template = new KafkaTemplate<>(kafkaProducerFactory);
    }

    @Override
    public void publishMessage(EmailServiceCommand message) {
        template.send(DEFAULT_TOPIC, message);
    }

}
