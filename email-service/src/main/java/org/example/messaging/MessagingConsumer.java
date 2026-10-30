package org.example.messaging;

import jakarta.mail.MessagingException;
import org.apache.kafka.clients.consumer.ConsumerRecord;

public interface MessagingConsumer {

    public void processEmailEvent(ConsumerRecord<String, EmailServiceCommand> consumerRecord) throws MessagingException;
}
