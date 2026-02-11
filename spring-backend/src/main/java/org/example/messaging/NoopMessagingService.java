package org.example.messaging;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Profile("!kafka-msg")
@Slf4j
@Service
public class NoopMessagingService implements MessagingService {

    @Override
    public void publishMessage(String message) {
        log.info("Noop messaging service logs message: {}", message);
    }
}
