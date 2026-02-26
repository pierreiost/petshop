package com.petshop.service;

import com.petshop.dto.RacaRequest;
import com.petshop.dto.RacaResponse;
import com.petshop.entity.Raca;
import com.petshop.exception.BusinessException;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.repository.RacaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RacaService {

    private final RacaRepository repository;

    public RacaService(RacaRepository repository) {
        this.repository = repository;
    }

    public RacaResponse criar(RacaRequest request) {
        if (repository.existsByDescricao(request.descricao())) {
            throw new BusinessException("Raça já cadastrada: " + request.descricao());
        }
        Raca raca = new Raca();
        raca.setDescricao(request.descricao());
        return toResponse(repository.save(raca));
    }

    public List<RacaResponse> listar() {
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public RacaResponse buscarPorId(Long id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Raça não encontrada: " + id));
    }

    public RacaResponse atualizar(Long id, RacaRequest request) {
        Raca raca = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Raça não encontrada: " + id));
        raca.setDescricao(request.descricao());
        return toResponse(repository.save(raca));
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Raça não encontrada: " + id);
        }
        repository.deleteById(id);
    }

    private RacaResponse toResponse(Raca r) {
        return new RacaResponse(r.getId(), r.getDescricao());
    }
}
