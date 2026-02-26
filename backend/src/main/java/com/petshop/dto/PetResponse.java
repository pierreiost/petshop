package com.petshop.dto;

import java.time.LocalDate;

public record PetResponse(
    Long id,
    String nome,
    LocalDate dataNascimento,
    RacaResponse raca,
    Long clienteId,
    String clienteNome,
    String foto
) {}
