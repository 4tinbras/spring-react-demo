package org.example.config;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.example.messaging.EmailServiceCommand;
import org.example.messaging.MessagingConsumer;
import org.example.messaging.NoopMessagingConsumer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JacksonJsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
public class ServiceConfig {

    @Value("${spring.kafka.bootstrap-servers:localhost:localhost:9092}")
    private String brokerEndpoint;

    @Profile("kafka-msg")
    @Bean(name = "kafkaConsumerFactory")
    public ConsumerFactory<String, EmailServiceCommand> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, brokerEndpoint);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "spreact");
        return new DefaultKafkaConsumerFactory<String, EmailServiceCommand>(
                props, new StringDeserializer(), new JacksonJsonDeserializer<>(EmailServiceCommand.class));
    }

    @Profile("kafka-msg")
    @Bean("kafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, EmailServiceCommand>
    kafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, EmailServiceCommand> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }

    @ConditionalOnMissingBean(value = MessagingConsumer.class)
    @Bean
    public NoopMessagingConsumer messagingService() {
        return new NoopMessagingConsumer();
    }
}
