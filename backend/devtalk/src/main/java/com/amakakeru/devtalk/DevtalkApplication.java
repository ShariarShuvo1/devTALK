package com.amakakeru.devtalk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class DevtalkApplication {

    public static void main(String[] args) {
        SpringApplication.run(DevtalkApplication.class, args);
    }

}
