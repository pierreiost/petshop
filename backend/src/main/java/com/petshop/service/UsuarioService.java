package com.petshop.service;

import com.petshop.dto.UsuarioRequest;
import com.petshop.dto.UsuarioResponse;
import com.petshop.entity.Usuario;
import com.petshop.exception.BusinessException;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public UsuarioResponse criar(UsuarioRequest request) {
        if (repository.existsByCpf(request.cpf())) {
            throw new BusinessException("CPF já cadastrado: " + request.cpf());
        }
        Usuario usuario = new Usuario();
        usuario.setCpf(request.cpf());
        usuario.setNome(request.nome());
        usuario.setPerfil(request.perfil());
        usuario.setSenha(encoder.encode(request.senha()));
        return toResponse(repository.save(usuario));
    }

    public List<UsuarioResponse> listar() {
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public UsuarioResponse buscarPorCpf(String cpf) {
        return repository.findByCpf(cpf)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + cpf));
    }

    public UsuarioResponse atualizar(String cpf, UsuarioRequest request) {
        Usuario usuario = repository.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + cpf));
        usuario.setNome(request.nome());
        usuario.setPerfil(request.perfil());
        if (request.senha() != null && !request.senha().isBlank()) {
            usuario.setSenha(encoder.encode(request.senha()));
        }
        return toResponse(repository.save(usuario));
    }

    public void deletar(String cpf) {
        if (!repository.existsByCpf(cpf)) {
            throw new ResourceNotFoundException("Usuário não encontrado: " + cpf);
        }
        repository.deleteById(cpf);
    }

    private UsuarioResponse toResponse(Usuario u) {
        return new UsuarioResponse(u.getCpf(), u.getNome(), u.getPerfil(), u.getFoto());
    }
}
