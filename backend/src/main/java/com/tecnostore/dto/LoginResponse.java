package com.tecnostore.dto;

import com.tecnostore.model.Role;

public record LoginResponse(
        Long id,
        String fullName,
        String email,
        Role role,
        String phone
) {
}
