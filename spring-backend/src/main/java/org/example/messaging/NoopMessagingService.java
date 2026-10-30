package org.example.messaging;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class NoopMessagingService implements MessagingService {

    @Override
    public void publishMessage(EmailServiceCommand message) {
        log.info("Noop messaging service logs message to 'send': {}", message);
    }
}
