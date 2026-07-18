package org.example.messaging;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;

@Slf4j
public class NoopMessagingConsumer implements MessagingConsumer {

    @Override
    public void processEmailEvent(ConsumerRecord<?, ?> consumerRecord) {
        log.info("Noop messaging service logs received message: {}", consumerRecord.value());
    }
}
