package org.example;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
public class ContextTest {

    private final TestRestTemplate testRestTemplate = new TestRestTemplate();
    @Value("${management.server.port}")
    private int mgt;
    @Autowired
    private MockMvc mockMvc;

    @Test
    void getHealthWithoutAuthZ_Returns200() {
        ResponseEntity<Map> entity = this.testRestTemplate.getForEntity(
                "http://localhost:" + this.mgt + "/actuator/health", Map.class);
        Assertions.assertEquals(HttpStatus.OK, entity.getStatusCode());
    }

    @Test
    void getOpenApiDescription_Returns200() {
        ResponseEntity<Map> entity = this.testRestTemplate.getForEntity(
                "http://localhost:8080/v3/api-docs", Map.class);
        Assertions.assertEquals(HttpStatus.OK, entity.getStatusCode());
    }
}
