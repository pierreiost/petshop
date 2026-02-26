package com.petshop.service;

import com.petshop.dto.PetRequest;
import com.petshop.dto.PetResponse;
import com.petshop.entity.Cliente;
import com.petshop.entity.Pet;
import com.petshop.entity.Raca;
import com.petshop.exception.BusinessException;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.repository.ClienteRepository;
import com.petshop.repository.PetRepository;
import com.petshop.repository.RacaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PetServiceTest {

    @Mock
    private PetRepository petRepo;

    @Mock
    private ClienteRepository clienteRepo;

    @Mock
    private RacaRepository racaRepo;

    @InjectMocks
    private PetService service;

    private Cliente cliente;
    private Raca raca;
    private Pet pet;

    @BeforeEach
    void setUp() {
        cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNome("João");
        cliente.setCpf("12345678901");

        raca = new Raca();
        raca.setId(1L);
        raca.setDescricao("Golden Retriever");

        pet = new Pet();
        pet.setId(1L);
        pet.setNome("Rex");
        pet.setCliente(cliente);
        pet.setRaca(raca);
    }

    @Test
    void deveCriarPetComSucesso() {
        PetRequest request = new PetRequest("Rex", 1L, LocalDate.of(2020, 1, 1), null);
        when(clienteRepo.findById(1L)).thenReturn(Optional.of(cliente));
        when(racaRepo.findById(1L)).thenReturn(Optional.of(raca));
        when(petRepo.save(any())).thenReturn(pet);

        PetResponse response = service.criar(1L, request, "12345678901", false);

        assertThat(response.nome()).isEqualTo("Rex");
        verify(petRepo).save(any());
    }

    @Test
    void deveNegarCriacaoParaClienteDeOutroTutor() {
        PetRequest request = new PetRequest("Rex", 1L, null, null);
        when(clienteRepo.findById(1L)).thenReturn(Optional.of(cliente));

        assertThatThrownBy(() -> service.criar(1L, request, "99999999999", false))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Acesso negado");
    }

    @Test
    void deveAdminCriarPetParaQualquerCliente() {
        PetRequest request = new PetRequest("Rex", 1L, null, null);
        when(clienteRepo.findById(1L)).thenReturn(Optional.of(cliente));
        when(racaRepo.findById(1L)).thenReturn(Optional.of(raca));
        when(petRepo.save(any())).thenReturn(pet);

        PetResponse response = service.criar(1L, request, "00000000000", true);

        assertThat(response.nome()).isEqualTo("Rex");
    }

    @Test
    void deveLancarExcecaoQuandoRacaNaoEncontrada() {
        PetRequest request = new PetRequest("Rex", 99L, null, null);
        when(clienteRepo.findById(1L)).thenReturn(Optional.of(cliente));
        when(racaRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.criar(1L, request, "12345678901", false))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Raça não encontrada");
    }

    @Test
    void deveListarPetsPorCliente() {
        when(clienteRepo.findById(1L)).thenReturn(Optional.of(cliente));
        when(petRepo.findByClienteId(1L)).thenReturn(List.of(pet));

        List<PetResponse> lista = service.listarPorCliente(1L, "12345678901", false);

        assertThat(lista).hasSize(1);
        assertThat(lista.get(0).nome()).isEqualTo("Rex");
    }

    @Test
    void deveBuscarPetPorId() {
        when(petRepo.findById(1L)).thenReturn(Optional.of(pet));

        PetResponse response = service.buscarPorId(1L);

        assertThat(response.nome()).isEqualTo("Rex");
    }

    @Test
    void deveLancarExcecaoQuandoPetNaoEncontrado() {
        when(petRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscarPorId(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
