package com.petshop.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ClienteResponse(
    Long id,
    String nome,
    String cpf,
    LocalDateTime dataCadastro,
    String foto,
    List<EnderecoResponse> enderecos,
    List<ContatoResponse> contatos
) {}
