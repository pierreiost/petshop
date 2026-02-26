package com.petshop.dto;

public record LoginResponse(
    String token,
    String cpf,
    String nome,
    String perfil
) {}
