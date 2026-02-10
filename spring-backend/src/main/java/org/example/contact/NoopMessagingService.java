package org.example.contact;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NoopMessagingService implements MessagingService {

    @Override
    public void publishMessage(String message) {
        log.info("Noop messaging service logs message: {}", message);
    }
}
