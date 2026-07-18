package org.example.messaging;

import lombok.Getter;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.stereotype.Component;

@Getter
@Component
public class KafkaConsumer implements MessagingConsumer {

    public static final String DEFAULT_TOPIC = "spreact-emails-out";

    private final Consumer<String, String> consumer;
    private String payload;

    // TODO: rethink once port conundrum gets solved
    public KafkaConsumer(ConsumerFactory<String, String> kafkaConsumerFactory) {
        this.consumer = kafkaConsumerFactory.createConsumer();
    }

    @KafkaListener(topics = {KafkaConsumer.DEFAULT_TOPIC}, groupId = "spreact")
    public void processEmailEvent(ConsumerRecord<?, ?> consumerRecord) {
        System.out.println("Received Message in default topic: " + consumerRecord.value());
        payload = consumerRecord.toString();
    }

}
