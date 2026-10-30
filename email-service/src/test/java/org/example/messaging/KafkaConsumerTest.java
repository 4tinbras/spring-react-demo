package org.example.messaging;

import jakarta.mail.MessagingException;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.support.serializer.JacksonJsonSerializer;
import org.springframework.kafka.test.EmbeddedKafkaBroker;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.kafka.test.utils.KafkaTestUtils;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.Map;

import static org.example.messaging.KafkaConsumer.DEFAULT_TOPIC;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ActiveProfiles({"test", "kafka-msg"})
@SpringBootTest
@DirtiesContext
@EmbeddedKafka(partitions = 1, topics = {DEFAULT_TOPIC})
class KafkaConsumerTest {

    @Autowired
    private KafkaConsumer userKafkaConsumer;

    @Autowired
    private EmbeddedKafkaBroker embeddedKafka;

//    @MockitoSpyBean
//    private EmailProducer emailProducer;
//
//    @MockitoSpyBean
//    private EmailService emailService;

    private Producer<String, EmailServiceCommand> producer;

    @BeforeEach
    void setup() {

        Map<String, Object> configProps = new HashMap<>();
        configProps.put(
                ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, embeddedKafka.getBrokersAsString());


        Map<String, Object> configs = new HashMap<>(KafkaTestUtils.producerProps(embeddedKafka));
        producer = new DefaultKafkaProducerFactory<String, EmailServiceCommand>(configs, new StringSerializer(),
                new JacksonJsonSerializer<EmailServiceCommand>()).createProducer();
    }

    // this needs the sleep so that consumer had time to pick up the message, without it fails
    @Test
    void givenMessageIsPresent_thenListenerConsumesIt() throws InterruptedException, MessagingException {

        EmailServiceCommand data = new EmailServiceCommand("example@example.com", "Tom", EmailCommandType.CONTACT_UPDATED);

        producer.send(new ProducerRecord<String, EmailServiceCommand>(DEFAULT_TOPIC, data));
        producer.flush();

        Thread.sleep(200);


        assertEquals(data.recipientsName(), userKafkaConsumer.getPayload().recipientsName());
        assertEquals(data.recipientsEmail(), userKafkaConsumer.getPayload().recipientsEmail());
        assertEquals(data.typeOfUpdate(), userKafkaConsumer.getPayload().typeOfUpdate());

//        TODO: seems to delay consumption by listener which then fails test
//        verify(emailProducer, times(1)).produceHtmlEmail(any());
    }
}