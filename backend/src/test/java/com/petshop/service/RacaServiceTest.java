package com.petshop.service;

import com.petshop.dto.RacaRequest;
import com.petshop.dto.RacaResponse;
import com.petshop.entity.Raca;
import com.petshop.exception.BusinessException;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.repository.RacaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RacaServiceTest {

    @Mock
    private RacaRepository repository;

    @InjectMocks
    private RacaService service;

    private Raca criarRaca(Long id, String descricao) {
        Raca raca = new Raca();
        raca.setId(id);
        raca.setDescricao(descricao);
        return raca;
    }

    @Test
    void deveCriarRacaComSucesso() {
        RacaRequest request = new RacaRequest("Golden Retriever");
        when(repository.existsByDescricao("Golden Retriever")).thenReturn(false);
        when(repository.save(any())).thenReturn(criarRaca(1L, "Golden Retriever"));

        RacaResponse response = service.criar(request);

        assertThat(response.descricao()).isEqualTo("Golden Retriever");
        verify(repository).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoRacaJaExiste() {
        when(repository.existsByDescricao("Poodle")).thenReturn(true);

        assertThatThrownBy(() -> service.criar(new RacaRequest("Poodle")))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Raça já cadastrada");
    }

    @Test
    void deveListarTodasAsRacas() {
        when(repository.findAll()).thenReturn(List.of(criarRaca(1L, "Golden"), criarRaca(2L, "Poodle")));

        List<RacaResponse> lista = service.listar();

        assertThat(lista).hasSize(2);
    }

    @Test
    void deveBuscarRacaPorId() {
        when(repository.findById(1L)).thenReturn(Optional.of(criarRaca(1L, "Yorkshire")));

        RacaResponse response = service.buscarPorId(1L);

        assertThat(response.descricao()).isEqualTo("Yorkshire");
    }

    @Test
    void deveLancarExcecaoQuandoRacaNaoEncontrada() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscarPorId(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deveDeletarRaca() {
        when(repository.existsById(1L)).thenReturn(true);

        service.deletar(1L);

        verify(repository).deleteById(1L);
    }
}
