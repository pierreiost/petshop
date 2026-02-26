package com.petshop.dto;

import com.petshop.enums.PerfilUsuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioRequest(
    @NotBlank(message = "CPF é obrigatório") String cpf,
    @NotBlank(message = "Nome é obrigatório") String nome,
    @NotNull(message = "Perfil é obrigatório") PerfilUsuario perfil,
    @NotBlank(message = "Senha é obrigatória") String senha
) {}
