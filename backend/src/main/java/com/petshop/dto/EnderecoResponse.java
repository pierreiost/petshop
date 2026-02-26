package com.petshop.dto;

public record EnderecoResponse(
    Long id,
    String logradouro,
    String cidade,
    String bairro,
    String complemento,
    String tag
) {}
