package com.courtbooking.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI courtBookingOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Court Booking System API")
                        .description("RESTful API for managing court bookings with enterprise standards")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Court Booking Team")
                                .email("support@courtbooking.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")));
    }
}
