package com.petshop.service;

import com.petshop.dto.UsuarioRequest;
import com.petshop.dto.UsuarioResponse;
import com.petshop.entity.Usuario;
import com.petshop.enums.PerfilUsuario;
import com.petshop.exception.BusinessException;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository repository;

    @Mock
    private PasswordEncoder encoder;

    @InjectMocks
    private UsuarioService service;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setCpf("12345678901");
        usuario.setNome("João");
        usuario.setPerfil(PerfilUsuario.CLIENTE);
        usuario.setSenha("hashedSenha");
    }

    @Test
    void deveCriarUsuarioComSucesso() {
        UsuarioRequest request = new UsuarioRequest("12345678901", "João", PerfilUsuario.CLIENTE, "senha123");
        when(repository.existsByCpf("12345678901")).thenReturn(false);
        when(encoder.encode(anyString())).thenReturn("hashedSenha");
        when(repository.save(any())).thenReturn(usuario);

        UsuarioResponse response = service.criar(request);

        assertThat(response.cpf()).isEqualTo("12345678901");
        assertThat(response.nome()).isEqualTo("João");
        verify(repository).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoCpfJaExiste() {
        UsuarioRequest request = new UsuarioRequest("12345678901", "João", PerfilUsuario.CLIENTE, "senha");
        when(repository.existsByCpf("12345678901")).thenReturn(true);

        assertThatThrownBy(() -> service.criar(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("CPF já cadastrado");
    }

    @Test
    void deveListarTodosOsUsuarios() {
        when(repository.findAll()).thenReturn(List.of(usuario));

        List<UsuarioResponse> lista = service.listar();

        assertThat(lista).hasSize(1);
        assertThat(lista.get(0).cpf()).isEqualTo("12345678901");
    }

    @Test
    void deveBuscarUsuarioPorCpf() {
        when(repository.findByCpf("12345678901")).thenReturn(Optional.of(usuario));

        UsuarioResponse response = service.buscarPorCpf("12345678901");

        assertThat(response.cpf()).isEqualTo("12345678901");
    }

    @Test
    void deveLancarExcecaoQuandoUsuarioNaoEncontrado() {
        when(repository.findByCpf("00000000000")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscarPorCpf("00000000000"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deveDeletarUsuario() {
        when(repository.existsByCpf("12345678901")).thenReturn(true);

        service.deletar("12345678901");

        verify(repository).deleteById("12345678901");
    }

    @Test
    void deveLancarExcecaoAoDeletarUsuarioInexistente() {
        when(repository.existsByCpf("00000000000")).thenReturn(false);

        assertThatThrownBy(() -> service.deletar("00000000000"))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
