package com.petshop.dto;

import com.petshop.enums.TipoContato;

public record ContatoResponse(
    Long id,
    String tag,
    TipoContato tipo,
    String valor
) {}
