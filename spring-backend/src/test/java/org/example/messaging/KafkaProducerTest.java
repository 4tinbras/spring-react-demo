package org.example.messaging;

import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.test.EmbeddedKafkaBroker;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.kafka.test.utils.KafkaTestUtils;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

import static org.example.messaging.KafkaProducer.DEFAULT_TOPIC;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ActiveProfiles({"test", "kafka-msg"})
@SpringBootTest
@DirtiesContext
@EmbeddedKafka(partitions = 1, topics = {DEFAULT_TOPIC})
class KafkaProducerTest {

    @Autowired
    private ProducerFactory<String, EmailServiceCommand> kafkaProducerFactory;

    private KafkaProducer producer;

    @Autowired
    private EmbeddedKafkaBroker embeddedKafka;

    @BeforeEach
    void setup() {
        //TODO: most configs I tried on embedded kafka didn't seem to pin down broker's port hence dynamic creation of provider
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(
                ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, embeddedKafka.getBrokersAsString());

        kafkaProducerFactory.updateConfigs(configProps);

        producer = new KafkaProducer(kafkaProducerFactory);
    }

    @Test
    public void givenEmbeddedKafkaBroker_whenSendingWithSimpleProducer_thenMessageReceived()
            throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        EmailServiceCommand data = new EmailServiceCommand("example@example.com", "Tom", "update");

        producer.publishMessage(data);

        Map<String, Object> consumerProps = KafkaTestUtils.consumerProps(embeddedKafka, "spreact", false);
        DefaultKafkaConsumerFactory<Integer, String> cf = new DefaultKafkaConsumerFactory<>(consumerProps);
        Consumer<Integer, String> consumer = cf.createConsumer();
        embeddedKafka.consumeFromAllEmbeddedTopics(consumer);
        ConsumerRecord<Integer, String> received = KafkaTestUtils.getSingleRecord(consumer, DEFAULT_TOPIC);
        EmailServiceCommand outcome = objectMapper.readValue(received.value(), EmailServiceCommand.class);
        assertEquals(data.typeOfUpdate(), outcome.typeOfUpdate());
        assertEquals(data.recipientsEmail(), outcome.recipientsEmail());
        assertEquals(data.recipientsName(), outcome.recipientsName());

    }
}