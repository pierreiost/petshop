package com.petshop.controller;

import com.petshop.dto.ClienteRequest;
import com.petshop.dto.ClienteResponse;
import com.petshop.dto.ContatoRequest;
import com.petshop.dto.ContatoResponse;
import com.petshop.dto.EnderecoRequest;
import com.petshop.dto.EnderecoResponse;
import com.petshop.service.ClienteService;
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
@RequestMapping("/api/v1/clientes")
@Tag(name = "Clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cria um novo cliente (Admin)")
    public ResponseEntity<ClienteResponse> criar(@Valid @RequestBody ClienteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lista todos os clientes (Admin)")
    public ResponseEntity<List<ClienteResponse>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca cliente por ID (próprio ou Admin)")
    public ResponseEntity<ClienteResponse> buscar(@PathVariable Long id, Authentication auth) {
        ClienteResponse cliente = service.buscarPorId(id);
        if (!isAdmin(auth) && !auth.getName().equals(cliente.cpf())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(cliente);
    }

    @GetMapping("/meu-perfil")
    @Operation(summary = "Retorna os dados do cliente autenticado")
    public ResponseEntity<ClienteResponse> meuPerfil(Authentication auth) {
        return ResponseEntity.ok(service.buscarPorCpf(auth.getName()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza cliente (próprio ou Admin)")
    public ResponseEntity<ClienteResponse> atualizar(@PathVariable Long id,
                                                     @Valid @RequestBody ClienteRequest request,
                                                     Authentication auth) {
        return ResponseEntity.ok(service.atualizar(id, request, auth.getName(), isAdmin(auth)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remove cliente (Admin)")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{clienteId}/enderecos")
    @Operation(summary = "Adiciona endereço ao cliente")
    public ResponseEntity<EnderecoResponse> adicionarEndereco(@PathVariable Long clienteId,
                                                              @Valid @RequestBody EnderecoRequest request,
                                                              Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.adicionarEndereco(clienteId, request, auth.getName(), isAdmin(auth)));
    }

    @GetMapping("/{clienteId}/enderecos")
    @Operation(summary = "Lista endereços do cliente")
    public ResponseEntity<List<EnderecoResponse>> listarEnderecos(@PathVariable Long clienteId, Authentication auth) {
        return ResponseEntity.ok(service.listarEnderecos(clienteId, auth.getName(), isAdmin(auth)));
    }

    @PutMapping("/{clienteId}/enderecos/{enderecoId}")
    @Operation(summary = "Atualiza endereço")
    public ResponseEntity<EnderecoResponse> atualizarEndereco(@PathVariable Long clienteId,
                                                              @PathVariable Long enderecoId,
                                                              @Valid @RequestBody EnderecoRequest request,
                                                              Authentication auth) {
        return ResponseEntity.ok(service.atualizarEndereco(clienteId, enderecoId, request, auth.getName(), isAdmin(auth)));
    }

    @DeleteMapping("/{clienteId}/enderecos/{enderecoId}")
    @Operation(summary = "Remove endereço")
    public ResponseEntity<Void> deletarEndereco(@PathVariable Long clienteId, @PathVariable Long enderecoId,
                                                Authentication auth) {
        service.deletarEndereco(clienteId, enderecoId, auth.getName(), isAdmin(auth));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{clienteId}/contatos")
    @Operation(summary = "Adiciona contato ao cliente")
    public ResponseEntity<ContatoResponse> adicionarContato(@PathVariable Long clienteId,
                                                            @Valid @RequestBody ContatoRequest request,
                                                            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.adicionarContato(clienteId, request, auth.getName(), isAdmin(auth)));
    }

    @GetMapping("/{clienteId}/contatos")
    @Operation(summary = "Lista contatos do cliente")
    public ResponseEntity<List<ContatoResponse>> listarContatos(@PathVariable Long clienteId, Authentication auth) {
        return ResponseEntity.ok(service.listarContatos(clienteId, auth.getName(), isAdmin(auth)));
    }

    @PutMapping("/{clienteId}/contatos/{contatoId}")
    @Operation(summary = "Atualiza contato")
    public ResponseEntity<ContatoResponse> atualizarContato(@PathVariable Long clienteId,
                                                            @PathVariable Long contatoId,
                                                            @Valid @RequestBody ContatoRequest request,
                                                            Authentication auth) {
        return ResponseEntity.ok(service.atualizarContato(clienteId, contatoId, request, auth.getName(), isAdmin(auth)));
    }

    @DeleteMapping("/{clienteId}/contatos/{contatoId}")
    @Operation(summary = "Remove contato")
    public ResponseEntity<Void> deletarContato(@PathVariable Long clienteId, @PathVariable Long contatoId,
                                               Authentication auth) {
        service.deletarContato(clienteId, contatoId, auth.getName(), isAdmin(auth));
        return ResponseEntity.noContent().build();
    }
}
