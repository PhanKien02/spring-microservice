package com.example.user.http;

import java.lang.reflect.Field;
import java.util.HashMap;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ResponseData {

    private Boolean isSuccess;
    private HttpStatus statusCode;
    private HashMap<String, Object> data;
    private String message;
    public ResponseData() {
        this.data = new HashMap<>();
    }

    public void addData(String key, Object data) {
        this.data.put(key, data);
    }

    public void copyData(Object data) {
        try {
            for (Field field : data.getClass().getDeclaredFields()) {
                field.setAccessible(true);
                Object value = field.get(data);
                this.data.put(field.getName(), value);
            }
        } catch (Exception ex) {}
    }
}

