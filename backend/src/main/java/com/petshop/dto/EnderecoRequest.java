package com.petshop.dto;

import jakarta.validation.constraints.NotBlank;

public record EnderecoRequest(
    @NotBlank(message = "Logradouro é obrigatório") String logradouro,
    @NotBlank(message = "Cidade é obrigatória") String cidade,
    @NotBlank(message = "Bairro é obrigatório") String bairro,
    String complemento,
    String tag
) {}
