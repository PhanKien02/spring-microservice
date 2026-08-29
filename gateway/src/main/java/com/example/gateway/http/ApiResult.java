package com.example.gateway.http;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;

public class ApiResult {

    public static ResponseEntity<ResponseData> success() {
        return response(HttpStatus.OK, "Thành công", new ResponseData(), null);
    }

    public static ResponseEntity<ResponseData> success(ResponseData data) {
        return response(HttpStatus.OK, "Thành công", data, null);
    }

    public static ResponseEntity<ResponseData> failed() {
        return response(HttpStatus.BAD_REQUEST, "Thất bại", new ResponseData(), null);
    }

    public static ResponseEntity<ResponseData> failed(String message) {
        return response(HttpStatus.BAD_REQUEST, message, new ResponseData(), null);
    }

    public static ResponseEntity<ResponseData> response(
            HttpStatus httpStatus,
            String message,
            ResponseData data,
            List<FieldError> fieldErrs) {
        if (data == null) {
            data = new ResponseData();
        }
        if (httpStatus.equals(HttpStatus.OK)) {
            data.setStatusCode(HttpStatus.OK);
            data.setIsSuccess(true);
        } else {
            data.setIsSuccess(false);
            data.setStatusCode(httpStatus);
            data.setMessage(message);
            data.setData(null);
        }
        return ResponseEntity.status(httpStatus).body(data);
    }
}
