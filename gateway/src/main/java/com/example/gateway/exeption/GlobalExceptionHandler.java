package com.example.gateway.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpClientErrorException.Unauthorized;

import com.example.gateway.http.ApiResult;
import com.example.gateway.http.ResponseData;

import java.util.HashMap;
import java.util.Map;
import io.jsonwebtoken.JwtException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Unauthorized.class)
    public ResponseEntity<ResponseData> handleAppException(AppException exception) {
        return ApiResult.response(HttpStatus.UNAUTHORIZED, "Invalid or expired token: " + exception.getMessage(), null,
                null);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ResponseData> handleJwtException(JwtException exception) {
        return ApiResult.response(HttpStatus.UNAUTHORIZED, "Invalid or expired token: " + exception.getMessage(), null,
                null);
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
        ResponseData responseData = new ResponseData();
        responseData.addData("exception", (exception));
        return ApiResult.response(HttpStatus.INTERNAL_SERVER_ERROR,
                exception.getMessage(), responseData, null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("errors", errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
