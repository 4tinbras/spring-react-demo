package org.example.messaging;

import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.test.EmbeddedKafkaBroker;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.kafka.test.utils.KafkaTestUtils;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.Map;

import static org.example.messaging.KafkaConsumer.DEFAULT_TOPIC;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsString;

@ActiveProfiles({"test", "kafka-msg"})
@SpringBootTest
@DirtiesContext
@EmbeddedKafka(partitions = 1, topics = {DEFAULT_TOPIC})
class KafkaConsumerTest {

    @Autowired
    private KafkaConsumer userKafkaConsumer;

    @Autowired
    private EmbeddedKafkaBroker embeddedKafka;

    private Producer<String, String> producer;

    @BeforeEach
    void setup() {

        Map<String, Object> configProps = new HashMap<>();
        configProps.put(
                ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, embeddedKafka.getBrokersAsString());


        Map<String, Object> configs = new HashMap<>(KafkaTestUtils.producerProps(embeddedKafka));
        producer = new DefaultKafkaProducerFactory<>(configs, new StringSerializer(), new StringSerializer()).createProducer();
    }

    // this needs the sleep so that consumer had time to pick up the message, without it fails
    @Test
    void givenMessageIsPresent_thenListenerConsumesIt() throws InterruptedException {

        producer.send(new ProducerRecord<>(DEFAULT_TOPIC, "Message"));
        producer.flush();

        Thread.sleep(200);


        assertThat(userKafkaConsumer.getPayload(), containsString("Message"));
    }
}