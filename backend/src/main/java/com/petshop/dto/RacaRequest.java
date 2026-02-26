package com.petshop.dto;

import jakarta.validation.constraints.NotBlank;

public record RacaRequest(
    @NotBlank(message = "Descrição é obrigatória") String descricao
) {}
