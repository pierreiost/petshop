package com.petshop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AtendimentoResponse(
    Long id,
    String descricao,
    BigDecimal valor,
    LocalDateTime data,
    Long petId,
    String petNome,
    Long clienteId,
    String clienteNome
) {}
