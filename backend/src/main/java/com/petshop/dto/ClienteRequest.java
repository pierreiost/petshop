package com.petshop.dto;

import jakarta.validation.constraints.NotBlank;

public record ClienteRequest(
    @NotBlank(message = "Nome é obrigatório") String nome,
    String cpf,
    String foto
) {}
