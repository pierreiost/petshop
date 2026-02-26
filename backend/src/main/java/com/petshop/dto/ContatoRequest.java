package com.petshop.dto;

import com.petshop.enums.TipoContato;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ContatoRequest(
    String tag,
    @NotNull(message = "Tipo é obrigatório") TipoContato tipo,
    @NotBlank(message = "Valor é obrigatório") String valor
) {}
