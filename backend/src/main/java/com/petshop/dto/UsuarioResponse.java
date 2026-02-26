package com.petshop.dto;

import com.petshop.enums.PerfilUsuario;

public record UsuarioResponse(
    String cpf,
    String nome,
    PerfilUsuario perfil,
    String foto
) {}
