package org.example.config;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.example.messaging.MessagingService;
import org.example.messaging.NoopMessagingService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.restclient.RestClientCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;

@Configuration
public class ServiceConfig {

    @Bean
    public RestClientCustomizer virtualThreadsCustomizer() {
        HttpClient httpClient = HttpClient.newBuilder()
                .executor(Executors.newVirtualThreadPerTaskExecutor())
                .version(HttpClient.Version.HTTP_2)
                .build();
        return (client) -> {
            client.requestFactory(new JdkClientHttpRequestFactory(httpClient));
        };
    }

    @Bean
    public RestClient defaultRestClient() {
        var httpClient = HttpClient.newBuilder()
                .executor(Executors.newVirtualThreadPerTaskExecutor())
                .version(HttpClient.Version.HTTP_2)
                .build();
        var requestFactory = new JdkClientHttpRequestFactory(httpClient);

        RestClient client = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
        return client;
    }

    @Profile("kafka-msg")
    @Bean(name = "kafkaProducerFactory")
    public ProducerFactory<String, String> kafkaProducerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(
                ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        configProps.put(
                ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
                StringSerializer.class);
        configProps.put(
                ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
                StringSerializer.class);
        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @ConditionalOnMissingBean(value = MessagingService.class)
    @Bean
    public NoopMessagingService messagingService() {
        return new NoopMessagingService();
    }
}
