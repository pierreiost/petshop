package com.petshop.service;

import com.petshop.dto.AtendimentoRequest;
import com.petshop.dto.AtendimentoResponse;
import com.petshop.entity.Atendimento;
import com.petshop.entity.Cliente;
import com.petshop.entity.Pet;
import com.petshop.entity.Raca;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.repository.AtendimentoRepository;
import com.petshop.repository.PetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AtendimentoServiceTest {

    @Mock
    private AtendimentoRepository atendimentoRepo;

    @Mock
    private PetRepository petRepo;

    @InjectMocks
    private AtendimentoService service;

    private Pet pet;
    private Atendimento atendimento;

    @BeforeEach
    void setUp() {
        Cliente cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNome("João");

        Raca raca = new Raca();
        raca.setId(1L);
        raca.setDescricao("Golden");

        pet = new Pet();
        pet.setId(1L);
        pet.setNome("Rex");
        pet.setCliente(cliente);
        pet.setRaca(raca);

        atendimento = new Atendimento();
        atendimento.setId(1L);
        atendimento.setPet(pet);
        atendimento.setDescricao("Banho e tosa");
        atendimento.setValor(new BigDecimal("80.00"));
        atendimento.setData(LocalDateTime.now());
    }

    @Test
    void deveCriarAtendimentoComSucesso() {
        AtendimentoRequest request = new AtendimentoRequest("Banho e tosa", new BigDecimal("80.00"), null);
        when(petRepo.findById(1L)).thenReturn(Optional.of(pet));
        when(atendimentoRepo.save(any())).thenReturn(atendimento);

        AtendimentoResponse response = service.criar(1L, request);

        assertThat(response.descricao()).isEqualTo("Banho e tosa");
        assertThat(response.valor()).isEqualByComparingTo("80.00");
        verify(atendimentoRepo).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoPetNaoEncontrado() {
        when(petRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.criar(99L, new AtendimentoRequest("Banho", BigDecimal.TEN, null)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Pet não encontrado");
    }

    @Test
    void deveListarTodosOsAtendimentos() {
        when(atendimentoRepo.findAll()).thenReturn(List.of(atendimento));

        List<AtendimentoResponse> lista = service.listarTodos();

        assertThat(lista).hasSize(1);
    }

    @Test
    void deveListarAtendimentosPorPet() {
        when(atendimentoRepo.findByPetId(1L)).thenReturn(List.of(atendimento));

        List<AtendimentoResponse> lista = service.listarPorPet(1L);

        assertThat(lista).hasSize(1);
        assertThat(lista.get(0).petNome()).isEqualTo("Rex");
    }

    @Test
    void deveListarAtendimentosPorCliente() {
        when(atendimentoRepo.findByPetClienteId(1L)).thenReturn(List.of(atendimento));

        List<AtendimentoResponse> lista = service.listarPorCliente(1L);

        assertThat(lista).hasSize(1);
    }

    @Test
    void deveAtualizarAtendimento() {
        AtendimentoRequest request = new AtendimentoRequest("Consulta", new BigDecimal("150.00"), null);
        when(atendimentoRepo.findById(1L)).thenReturn(Optional.of(atendimento));
        when(atendimentoRepo.save(any())).thenReturn(atendimento);

        AtendimentoResponse response = service.atualizar(1L, request);

        verify(atendimentoRepo).save(any());
    }

    @Test
    void deveDeletarAtendimento() {
        when(atendimentoRepo.existsById(1L)).thenReturn(true);

        service.deletar(1L);

        verify(atendimentoRepo).deleteById(1L);
    }

    @Test
    void deveLancarExcecaoAoDeletarAtendimentoInexistente() {
        when(atendimentoRepo.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.deletar(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
