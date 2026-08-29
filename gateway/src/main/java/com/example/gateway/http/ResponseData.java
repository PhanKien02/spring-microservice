package com.example.gateway.http;

import java.lang.reflect.Field;
import java.util.HashMap;

import org.springframework.http.HttpStatus;

public class ResponseData {

    private Boolean isSuccess;
    private HttpStatus statusCode;
    private HashMap<String, Object> data;
    private String message;

    public ResponseData() {
        this.data = new HashMap<>();
    }

    public Boolean getIsSuccess() {
        return isSuccess;
    }

    public void setIsSuccess(Boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    public HttpStatus getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(HttpStatus statusCode) {
        this.statusCode = statusCode;
    }

    public HashMap<String, Object> getData() {
        return data;
    }

    public void setData(HashMap<String, Object> data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
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
        } catch (Exception ex) {
        }
    }
}
