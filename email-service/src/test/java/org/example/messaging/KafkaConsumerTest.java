package org.example.messaging;

import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.ProducerFactory;
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
    private ConsumerFactory<String, String> kafkaConsumerFactory;

//    private KafkaConsumer consumer;

    @Autowired
    private KafkaConsumer userKafkaConsumer;

    private KafkaConsumer spyOnConsumer;

    @Autowired
    private EmbeddedKafkaBroker embeddedKafka;

    private Producer<String, String> producer;


    @BeforeEach
    void setup() {
        //TODO: most configs I tried on embedded kafka didn't seem to pin down broker's port hence dynamic creation of provider
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(
                ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, embeddedKafka.getBrokersAsString());

        spyOnConsumer = Mockito.spy(userKafkaConsumer);


        Map<String, Object> configs = new HashMap<>(KafkaTestUtils.producerProps(embeddedKafka));
        producer = new DefaultKafkaProducerFactory<>(configs, new StringSerializer(), new StringSerializer()).createProducer();
    }

    @Disabled("Factory needs to know port, but due to issues with configuring test with preset port it becomes chicken and egg problem")
    @Test
    void givenMessageIsPresent_thenListenerConsumesIt() throws InterruptedException {

        producer.send(new ProducerRecord<>(DEFAULT_TOPIC, "Message"));
        producer.flush();

        // below works contrary to the original code further down
//        Map<String, Object> consumerProps = KafkaTestUtils.consumerProps(embeddedKafka, "spreact", false);
//        DefaultKafkaConsumerFactory<Integer, String> cf = new DefaultKafkaConsumerFactory<>(consumerProps);
//        Consumer<Integer, String> consumer1 = cf.createConsumer();
//        embeddedKafka.consumeFromAllEmbeddedTopics(consumer1);
//        ConsumerRecord<Integer, String> received = KafkaTestUtils.getSingleRecord(consumer1, DEFAULT_TOPIC);

//        boolean messageConsumed = consumer.getLatch().await(10, TimeUnit.SECONDS);
//
//        assertTrue(messageConsumed);
        assertThat(userKafkaConsumer.getPayload(), containsString("Message"));
//
//        verify(spyOnConsumer).processEmailEvent(any());
    }

    public ProducerFactory<String, String> kafkaProducerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(
                ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, embeddedKafka.getBrokersAsString());
        configProps.put(
                ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
                StringSerializer.class);
        configProps.put(
                ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
                StringSerializer.class);
        return new DefaultKafkaProducerFactory<>(configProps);
    }
}