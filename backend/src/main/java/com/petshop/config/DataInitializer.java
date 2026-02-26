package com.petshop.config;

import com.petshop.entity.Atendimento;
import com.petshop.entity.Cliente;
import com.petshop.entity.Contato;
import com.petshop.entity.Endereco;
import com.petshop.entity.Pet;
import com.petshop.entity.Raca;
import com.petshop.entity.Usuario;
import com.petshop.enums.PerfilUsuario;
import com.petshop.enums.TipoContato;
import com.petshop.repository.AtendimentoRepository;
import com.petshop.repository.ClienteRepository;
import com.petshop.repository.ContatoRepository;
import com.petshop.repository.EnderecoRepository;
import com.petshop.repository.PetRepository;
import com.petshop.repository.RacaRepository;
import com.petshop.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepo;
    private final ClienteRepository clienteRepo;
    private final RacaRepository racaRepo;
    private final PetRepository petRepo;
    private final AtendimentoRepository atendimentoRepo;
    private final EnderecoRepository enderecoRepo;
    private final ContatoRepository contatoRepo;
    private final PasswordEncoder encoder;

    public DataInitializer(UsuarioRepository usuarioRepo, ClienteRepository clienteRepo,
                           RacaRepository racaRepo, PetRepository petRepo,
                           AtendimentoRepository atendimentoRepo, EnderecoRepository enderecoRepo,
                           ContatoRepository contatoRepo, PasswordEncoder encoder) {
        this.usuarioRepo = usuarioRepo;
        this.clienteRepo = clienteRepo;
        this.racaRepo = racaRepo;
        this.petRepo = petRepo;
        this.atendimentoRepo = atendimentoRepo;
        this.enderecoRepo = enderecoRepo;
        this.contatoRepo = contatoRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepo.count() > 0) return;

        Usuario admin = new Usuario();
        admin.setCpf("00000000000");
        admin.setNome("Administrador");
        admin.setPerfil(PerfilUsuario.ADMIN);
        admin.setSenha(encoder.encode("admin123"));
        usuarioRepo.save(admin);

        Usuario clienteUser = new Usuario();
        clienteUser.setCpf("12345678901");
        clienteUser.setNome("João Silva");
        clienteUser.setPerfil(PerfilUsuario.CLIENTE);
        clienteUser.setSenha(encoder.encode("cliente123"));
        usuarioRepo.save(clienteUser);

        Raca golden = new Raca();
        golden.setDescricao("Golden Retriever");
        racaRepo.save(golden);

        Raca poodle = new Raca();
        poodle.setDescricao("Poodle");
        racaRepo.save(poodle);

        Raca siames = new Raca();
        siames.setDescricao("Siamês");
        racaRepo.save(siames);

        Raca bulldog = new Raca();
        bulldog.setDescricao("Bulldog Francês");
        racaRepo.save(bulldog);

        Raca yorkshire = new Raca();
        yorkshire.setDescricao("Yorkshire");
        racaRepo.save(yorkshire);

        Cliente joao = new Cliente();
        joao.setNome("João Silva");
        joao.setCpf("12345678901");
        clienteRepo.save(joao);

        Endereco endJoao = new Endereco();
        endJoao.setCliente(joao);
        endJoao.setLogradouro("Rua das Flores, 123");
        endJoao.setCidade("São Paulo");
        endJoao.setBairro("Jardim América");
        endJoao.setComplemento("Apto 45");
        endJoao.setTag("Casa");
        enderecoRepo.save(endJoao);

        Contato telJoao = new Contato();
        telJoao.setCliente(joao);
        telJoao.setTipo(TipoContato.TELEFONE);
        telJoao.setValor("(11) 99999-1234");
        telJoao.setTag("Celular");
        contatoRepo.save(telJoao);

        Contato emailJoao = new Contato();
        emailJoao.setCliente(joao);
        emailJoao.setTipo(TipoContato.EMAIL);
        emailJoao.setValor("joao@email.com");
        emailJoao.setTag("Pessoal");
        contatoRepo.save(emailJoao);

        Cliente maria = new Cliente();
        maria.setNome("Maria Santos");
        maria.setCpf("98765432100");
        clienteRepo.save(maria);

        Endereco endMaria = new Endereco();
        endMaria.setCliente(maria);
        endMaria.setLogradouro("Av. Paulista, 1000");
        endMaria.setCidade("São Paulo");
        endMaria.setBairro("Bela Vista");
        endMaria.setTag("Trabalho");
        enderecoRepo.save(endMaria);

        Pet rex = new Pet();
        rex.setCliente(joao);
        rex.setRaca(golden);
        rex.setNome("Rex");
        rex.setDataNascimento(LocalDate.of(2020, 3, 15));
        petRepo.save(rex);

        Pet bolinha = new Pet();
        bolinha.setCliente(joao);
        bolinha.setRaca(poodle);
        bolinha.setNome("Bolinha");
        bolinha.setDataNascimento(LocalDate.of(2021, 7, 22));
        petRepo.save(bolinha);

        Pet mimi = new Pet();
        mimi.setCliente(maria);
        mimi.setRaca(siames);
        mimi.setNome("Mimi");
        mimi.setDataNascimento(LocalDate.of(2019, 11, 5));
        petRepo.save(mimi);

        Atendimento a1 = new Atendimento();
        a1.setPet(rex);
        a1.setDescricao("Banho e tosa completa");
        a1.setValor(new BigDecimal("85.00"));
        a1.setData(LocalDateTime.now().minusDays(10));
        atendimentoRepo.save(a1);

        Atendimento a2 = new Atendimento();
        a2.setPet(rex);
        a2.setDescricao("Consulta veterinária - vacinação anual");
        a2.setValor(new BigDecimal("150.00"));
        a2.setData(LocalDateTime.now().minusDays(3));
        atendimentoRepo.save(a2);

        Atendimento a3 = new Atendimento();
        a3.setPet(bolinha);
        a3.setDescricao("Tosa estética poodle");
        a3.setValor(new BigDecimal("120.00"));
        a3.setData(LocalDateTime.now().minusDays(5));
        atendimentoRepo.save(a3);

        Atendimento a4 = new Atendimento();
        a4.setPet(mimi);
        a4.setDescricao("Banho especial para gatos");
        a4.setValor(new BigDecimal("70.00"));
        a4.setData(LocalDateTime.now().minusDays(1));
        atendimentoRepo.save(a4);
    }
}
