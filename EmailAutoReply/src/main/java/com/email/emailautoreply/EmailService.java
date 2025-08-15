package com.email.emailautoreply;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiapiUrl;

    @Value("${gemini.api.key}")
    private String geminiapiKey; // Fixed variable name

    public EmailService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateReply(EmailRequest emailRequest) {
        try {
            // Build the prompt
            String prompt = buildPrompt(emailRequest); // Fixed method name

            // Create request payload
            Map<String, Object> requestBody = Map.of(
                    "contents", new Object[]{
                            Map.of("parts", new Object[]{
                                    Map.of("text", prompt)
                            })
                    }
            );

            // Make the API call
            String response = webClient.post()
                    .uri(geminiapiUrl + "?key=" + geminiapiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .bodyValue(requestBody) 
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return extractResponse(response);

        } catch (WebClientResponseException e) {
            return "Error calling Gemini API: " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
        } catch (Exception e) {
            return "Error generating reply: " + e.getMessage();
        }
    }

    private String extractResponse(String response) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            return "Error parsing response: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) { // Fixed method name
        StringBuilder sb = new StringBuilder();
        sb.append("Generate professional email reply for the following email content. Please don't create the subject line. We have to use in email reply generator project."); // Fixed typo

        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            sb.append(" Tone: ").append(emailRequest.getTone()); // Added space
        }

        sb.append("\nOriginal email: ").append(emailRequest.getEmailContent());
        return sb.toString();
    }
}