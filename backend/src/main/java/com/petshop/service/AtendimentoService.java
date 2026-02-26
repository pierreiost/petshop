package com.petshop.service;

import com.petshop.dto.AtendimentoRequest;
import com.petshop.dto.AtendimentoResponse;
import com.petshop.entity.Atendimento;
import com.petshop.entity.Pet;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.repository.AtendimentoRepository;
import com.petshop.repository.PetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AtendimentoService {

    private final AtendimentoRepository atendimentoRepo;
    private final PetRepository petRepo;

    public AtendimentoService(AtendimentoRepository atendimentoRepo, PetRepository petRepo) {
        this.atendimentoRepo = atendimentoRepo;
        this.petRepo = petRepo;
    }

    public AtendimentoResponse criar(Long petId, AtendimentoRequest request) {
        Pet pet = petRepo.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado: " + petId));
        Atendimento atendimento = new Atendimento();
        atendimento.setPet(pet);
        atendimento.setDescricao(request.descricao());
        atendimento.setValor(request.valor());
        atendimento.setData(request.data());
        return toResponse(atendimentoRepo.save(atendimento));
    }

    public List<AtendimentoResponse> listarTodos() {
        return atendimentoRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<AtendimentoResponse> listarPorPet(Long petId) {
        return atendimentoRepo.findByPetId(petId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<AtendimentoResponse> listarPorCliente(Long clienteId) {
        return atendimentoRepo.findByPetClienteId(clienteId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public AtendimentoResponse buscarPorId(Long id) {
        return atendimentoRepo.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Atendimento não encontrado: " + id));
    }

    public AtendimentoResponse atualizar(Long id, AtendimentoRequest request) {
        Atendimento atendimento = atendimentoRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atendimento não encontrado: " + id));
        atendimento.setDescricao(request.descricao());
        atendimento.setValor(request.valor());
        if (request.data() != null) {
            atendimento.setData(request.data());
        }
        return toResponse(atendimentoRepo.save(atendimento));
    }

    public void deletar(Long id) {
        if (!atendimentoRepo.existsById(id)) {
            throw new ResourceNotFoundException("Atendimento não encontrado: " + id);
        }
        atendimentoRepo.deleteById(id);
    }

    private AtendimentoResponse toResponse(Atendimento a) {
        return new AtendimentoResponse(a.getId(), a.getDescricao(), a.getValor(), a.getData(),
                a.getPet().getId(), a.getPet().getNome(),
                a.getPet().getCliente().getId(), a.getPet().getCliente().getNome());
    }
}
