package org.example.messaging;

import org.apache.kafka.clients.consumer.ConsumerRecord;

public interface MessagingConsumer {

    public void processEmailEvent(ConsumerRecord<?, ?> consumerRecord);
}
