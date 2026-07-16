package com.tecnostore.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ValidationRulesTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void rechazaPasswordDebil() {
        RegisterRequest request = new RegisterRequest("Usuario", "user@test.com", "usuario", "955123456");
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void aceptaPasswordYTelefonoValidos() {
        RegisterRequest request = new RegisterRequest("Usuario", "user@test.com", "Usuario@123", "955123456");
        assertTrue(validator.validate(request).isEmpty());
    }

    @Test
    void rechazaTelefonoInvalidoEnPedido() {
        OrderRequest request = new OrderRequest(1L, "Usuario", "855123456", "Lima", "", java.util.List.of(new OrderItemRequest(1L, 1)));
        assertFalse(validator.validate(request).isEmpty());
    }
}
