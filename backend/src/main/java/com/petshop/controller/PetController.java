package com.petshop.controller;

import com.petshop.dto.PetRequest;
import com.petshop.dto.PetResponse;
import com.petshop.service.PetService;
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
@Tag(name = "Pets")
public class PetController {

    private final PetService service;

    public PetController(PetService service) {
        this.service = service;
    }

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    @PostMapping("/clientes/{clienteId}/pets")
    @Operation(summary = "Cria pet para um cliente")
    public ResponseEntity<PetResponse> criar(@PathVariable Long clienteId,
                                             @Valid @RequestBody PetRequest request,
                                             Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.criar(clienteId, request, auth.getName(), isAdmin(auth)));
    }

    @GetMapping("/pets")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lista todos os pets (Admin)")
    public ResponseEntity<List<PetResponse>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/clientes/{clienteId}/pets")
    @Operation(summary = "Lista pets de um cliente (próprio ou Admin)")
    public ResponseEntity<List<PetResponse>> listarPorCliente(@PathVariable Long clienteId, Authentication auth) {
        return ResponseEntity.ok(service.listarPorCliente(clienteId, auth.getName(), isAdmin(auth)));
    }

    @GetMapping("/pets/{id}")
    @Operation(summary = "Busca pet por ID")
    public ResponseEntity<PetResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/pets/{id}")
    @Operation(summary = "Atualiza pet (próprio ou Admin)")
    public ResponseEntity<PetResponse> atualizar(@PathVariable Long id,
                                                 @Valid @RequestBody PetRequest request,
                                                 Authentication auth) {
        return ResponseEntity.ok(service.atualizar(id, request, auth.getName(), isAdmin(auth)));
    }

    @DeleteMapping("/pets/{id}")
    @Operation(summary = "Remove pet (próprio ou Admin)")
    public ResponseEntity<Void> deletar(@PathVariable Long id, Authentication auth) {
        service.deletar(id, auth.getName(), isAdmin(auth));
        return ResponseEntity.noContent().build();
    }
}
