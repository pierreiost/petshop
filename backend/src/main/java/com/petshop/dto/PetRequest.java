package com.petshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record PetRequest(
    @NotBlank(message = "Nome é obrigatório") String nome,
    @NotNull(message = "Raça é obrigatória") Long racaId,
    LocalDate dataNascimento,
    String foto
) {}
