package com.petshop.service;

import com.petshop.dto.PetRequest;
import com.petshop.dto.PetResponse;
import com.petshop.dto.RacaResponse;
import com.petshop.entity.Cliente;
import com.petshop.entity.Pet;
import com.petshop.entity.Raca;
import com.petshop.exception.BusinessException;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.repository.ClienteRepository;
import com.petshop.repository.PetRepository;
import com.petshop.repository.RacaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PetService {

    private final PetRepository petRepo;
    private final ClienteRepository clienteRepo;
    private final RacaRepository racaRepo;

    public PetService(PetRepository petRepo, ClienteRepository clienteRepo, RacaRepository racaRepo) {
        this.petRepo = petRepo;
        this.clienteRepo = clienteRepo;
        this.racaRepo = racaRepo;
    }

    public PetResponse criar(Long clienteId, PetRequest request, String cpfAutenticado, boolean isAdmin) {
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado: " + clienteId));

        if (!isAdmin && !cpfAutenticado.equals(cliente.getCpf())) {
            throw new BusinessException("Acesso negado");
        }

        Raca raca = racaRepo.findById(request.racaId())
                .orElseThrow(() -> new ResourceNotFoundException("Raça não encontrada: " + request.racaId()));

        Pet pet = new Pet();
        pet.setCliente(cliente);
        pet.setRaca(raca);
        pet.setNome(request.nome());
        pet.setDataNascimento(request.dataNascimento());
        pet.setFoto(request.foto());
        return toResponse(petRepo.save(pet));
    }

    public List<PetResponse> listarTodos() {
        return petRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<PetResponse> listarPorCliente(Long clienteId, String cpfAutenticado, boolean isAdmin) {
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado: " + clienteId));

        if (!isAdmin && !cpfAutenticado.equals(cliente.getCpf())) {
            throw new BusinessException("Acesso negado");
        }

        return petRepo.findByClienteId(clienteId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PetResponse buscarPorId(Long id) {
        return petRepo.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado: " + id));
    }

    public PetResponse atualizar(Long id, PetRequest request, String cpfAutenticado, boolean isAdmin) {
        Pet pet = petRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado: " + id));

        if (!isAdmin && !cpfAutenticado.equals(pet.getCliente().getCpf())) {
            throw new BusinessException("Acesso negado");
        }

        Raca raca = racaRepo.findById(request.racaId())
                .orElseThrow(() -> new ResourceNotFoundException("Raça não encontrada"));
        pet.setNome(request.nome());
        pet.setRaca(raca);
        pet.setDataNascimento(request.dataNascimento());
        if (request.foto() != null) {
            pet.setFoto(request.foto());
        }
        return toResponse(petRepo.save(pet));
    }

    public void deletar(Long id, String cpfAutenticado, boolean isAdmin) {
        Pet pet = petRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado: " + id));

        if (!isAdmin && !cpfAutenticado.equals(pet.getCliente().getCpf())) {
            throw new BusinessException("Acesso negado");
        }

        petRepo.deleteById(id);
    }

    public PetResponse toResponse(Pet p) {
        RacaResponse raca = new RacaResponse(p.getRaca().getId(), p.getRaca().getDescricao());
        return new PetResponse(p.getId(), p.getNome(), p.getDataNascimento(), raca,
                p.getCliente().getId(), p.getCliente().getNome(), p.getFoto());
    }
}
