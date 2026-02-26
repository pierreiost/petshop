package com.petshop.controller;

import com.petshop.dto.AtendimentoRequest;
import com.petshop.dto.AtendimentoResponse;
import com.petshop.service.AtendimentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Atendimentos")
public class AtendimentoController {

    private final AtendimentoService service;

    public AtendimentoController(AtendimentoService service) {
        this.service = service;
    }

    @PostMapping("/pets/{petId}/atendimentos")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Registra atendimento (Admin)")
    public ResponseEntity<AtendimentoResponse> criar(@PathVariable Long petId,
                                                     @Valid @RequestBody AtendimentoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(petId, request));
    }

    @GetMapping("/atendimentos")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lista todos os atendimentos (Admin)")
    public ResponseEntity<List<AtendimentoResponse>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/pets/{petId}/atendimentos")
    @Operation(summary = "Lista atendimentos por pet")
    public ResponseEntity<List<AtendimentoResponse>> listarPorPet(@PathVariable Long petId, Authentication auth) {
        return ResponseEntity.ok(service.listarPorPet(petId));
    }

    @GetMapping("/clientes/{clienteId}/atendimentos")
    @Operation(summary = "Lista atendimentos por cliente")
    public ResponseEntity<List<AtendimentoResponse>> listarPorCliente(@PathVariable Long clienteId, Authentication auth) {
        return ResponseEntity.ok(service.listarPorCliente(clienteId));
    }

    @GetMapping("/atendimentos/{id}")
    @Operation(summary = "Busca atendimento por ID")
    public ResponseEntity<AtendimentoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/atendimentos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualiza atendimento (Admin)")
    public ResponseEntity<AtendimentoResponse> atualizar(@PathVariable Long id,
                                                         @Valid @RequestBody AtendimentoRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @DeleteMapping("/atendimentos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remove atendimento (Admin)")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
