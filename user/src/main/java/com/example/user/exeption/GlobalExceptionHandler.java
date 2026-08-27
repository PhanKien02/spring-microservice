package com.example.user.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import com.example.user.http.ApiResult;
import com.example.user.http.ResponseData;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ResponseData> handleAppException(AppException exception) {
        return ApiResult.response(exception.getStatus(), exception.getMessage(), null, null);
    }

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<ResponseData> handleHttpClientError(HttpClientErrorException exception) {
        HttpStatus status = HttpStatus.resolve(exception.getStatusCode().value());
        if (status == null) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return ApiResult.response(status, exception.getMessage(), null, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseData> handleUnexpectedException(Exception exception) {
        return ApiResult.response(HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal server error", null, null);
    }
}
