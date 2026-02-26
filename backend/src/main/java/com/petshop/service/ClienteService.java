package com.petshop.service;

import com.petshop.dto.ClienteRequest;
import com.petshop.dto.ClienteResponse;
import com.petshop.dto.ContatoRequest;
import com.petshop.dto.ContatoResponse;
import com.petshop.dto.EnderecoRequest;
import com.petshop.dto.EnderecoResponse;
import com.petshop.entity.Cliente;
import com.petshop.entity.Contato;
import com.petshop.entity.Endereco;
import com.petshop.exception.BusinessException;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.repository.ClienteRepository;
import com.petshop.repository.ContatoRepository;
import com.petshop.repository.EnderecoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepo;
    private final EnderecoRepository enderecoRepo;
    private final ContatoRepository contatoRepo;

    public ClienteService(ClienteRepository clienteRepo, EnderecoRepository enderecoRepo,
                          ContatoRepository contatoRepo) {
        this.clienteRepo = clienteRepo;
        this.enderecoRepo = enderecoRepo;
        this.contatoRepo = contatoRepo;
    }

    public ClienteResponse criar(ClienteRequest request) {
        if (request.cpf() != null && clienteRepo.existsByCpf(request.cpf())) {
            throw new BusinessException("CPF já cadastrado para outro cliente");
        }
        Cliente cliente = new Cliente();
        cliente.setNome(request.nome());
        cliente.setCpf(request.cpf());
        cliente.setFoto(request.foto());
        return toResponse(clienteRepo.save(cliente));
    }

    public List<ClienteResponse> listar() {
        return clienteRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ClienteResponse buscarPorId(Long id) {
        Cliente cliente = clienteRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado: " + id));
        return toResponse(cliente);
    }

    public ClienteResponse buscarPorCpf(String cpf) {
        Cliente cliente = clienteRepo.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado para CPF: " + cpf));
        return toResponse(cliente);
    }

    public ClienteResponse atualizar(Long id, ClienteRequest request, String cpfAutenticado, boolean isAdmin) {
        Cliente cliente = clienteRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado: " + id));

        if (!isAdmin && !cpfAutenticado.equals(cliente.getCpf())) {
            throw new BusinessException("Acesso negado: você só pode editar seus próprios dados");
        }

        cliente.setNome(request.nome());
        if (request.foto() != null) {
            cliente.setFoto(request.foto());
        }
        return toResponse(clienteRepo.save(cliente));
    }

    public void deletar(Long id) {
        if (!clienteRepo.existsById(id)) {
            throw new ResourceNotFoundException("Cliente não encontrado: " + id);
        }
        clienteRepo.deleteById(id);
    }

    public EnderecoResponse adicionarEndereco(Long clienteId, EnderecoRequest request, String cpfAutenticado, boolean isAdmin) {
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado: " + clienteId));

        if (!isAdmin && !cpfAutenticado.equals(cliente.getCpf())) {
            throw new BusinessException("Acesso negado");
        }

        Endereco endereco = new Endereco();
        endereco.setCliente(cliente);
        endereco.setLogradouro(request.logradouro());
        endereco.setCidade(request.cidade());
        endereco.setBairro(request.bairro());
        endereco.setComplemento(request.complemento());
        endereco.setTag(request.tag());
        return toEnderecoResponse(enderecoRepo.save(endereco));
    }

    public List<EnderecoResponse> listarEnderecos(Long clienteId, String cpfAutenticado, boolean isAdmin) {
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado: " + clienteId));

        if (!isAdmin && !cpfAutenticado.equals(cliente.getCpf())) {
            throw new BusinessException("Acesso negado");
        }

        return enderecoRepo.findByClienteId(clienteId).stream()
                .map(this::toEnderecoResponse).collect(Collectors.toList());
    }

    public EnderecoResponse atualizarEndereco(Long clienteId, Long enderecoId, EnderecoRequest request,
                                               String cpfAutenticado, boolean isAdmin) {
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
        if (!isAdmin && !cpfAutenticado.equals(cliente.getCpf())) {
            throw new BusinessException("Acesso negado");
        }
        Endereco endereco = enderecoRepo.findById(enderecoId)
                .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado: " + enderecoId));
        endereco.setLogradouro(request.logradouro());
        endereco.setCidade(request.cidade());
        endereco.setBairro(request.bairro());
        endereco.setComplemento(request.complemento());
        endereco.setTag(request.tag());
        return toEnderecoResponse(enderecoRepo.save(endereco));
    }

    public void deletarEndereco(Long clienteId, Long enderecoId, String cpfAutenticado, boolean isAdmin) {
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
        if (!isAdmin && !cpfAutenticado.equals(cliente.getCpf())) {
            throw new BusinessException("Acesso negado");
        }
        enderecoRepo.deleteById(enderecoId);
    }

    public ContatoResponse adicionarContato(Long clienteId, ContatoRequest request, String cpfAutenticado, boolean isAdmin) {
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado: " + clienteId));
        if (!isAdmin && !cpfAutenticado.equals(cliente.getCpf())) {
            throw new BusinessException("Acesso negado");
        }
        Contato contato = new Contato();
        contato.setCliente(cliente);
        contato.setTag(request.tag());
        contato.setTipo(request.tipo());
        contato.setValor(request.valor());
        return toContatoResponse(contatoRepo.save(contato));
    }

    public List<ContatoResponse> listarContatos(Long clienteId, String cpfAutenticado, boolean isAdmin) {
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado: " + clienteId));
        if (!isAdmin && !cpfAutenticado.equals(cliente.getCpf())) {
            throw new BusinessException("Acesso negado");
        }
        return contatoRepo.findByClienteId(clienteId).stream()
                .map(this::toContatoResponse).collect(Collectors.toList());
    }

    public ContatoResponse atualizarContato(Long clienteId, Long contatoId, ContatoRequest request,
                                             String cpfAutenticado, boolean isAdmin) {
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
        if (!isAdmin && !cpfAutenticado.equals(cliente.getCpf())) {
            throw new BusinessException("Acesso negado");
        }
        Contato contato = contatoRepo.findById(contatoId)
                .orElseThrow(() -> new ResourceNotFoundException("Contato não encontrado: " + contatoId));
        contato.setTag(request.tag());
        contato.setTipo(request.tipo());
        contato.setValor(request.valor());
        return toContatoResponse(contatoRepo.save(contato));
    }

    public void deletarContato(Long clienteId, Long contatoId, String cpfAutenticado, boolean isAdmin) {
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
        if (!isAdmin && !cpfAutenticado.equals(cliente.getCpf())) {
            throw new BusinessException("Acesso negado");
        }
        contatoRepo.deleteById(contatoId);
    }

    private ClienteResponse toResponse(Cliente c) {
        List<EnderecoResponse> enderecos = enderecoRepo.findByClienteId(c.getId())
                .stream().map(this::toEnderecoResponse).collect(Collectors.toList());
        List<ContatoResponse> contatos = contatoRepo.findByClienteId(c.getId())
                .stream().map(this::toContatoResponse).collect(Collectors.toList());
        return new ClienteResponse(c.getId(), c.getNome(), c.getCpf(), c.getDataCadastro(),
                c.getFoto(), enderecos, contatos);
    }

    private EnderecoResponse toEnderecoResponse(Endereco e) {
        return new EnderecoResponse(e.getId(), e.getLogradouro(), e.getCidade(),
                e.getBairro(), e.getComplemento(), e.getTag());
    }

    private ContatoResponse toContatoResponse(Contato c) {
        return new ContatoResponse(c.getId(), c.getTag(), c.getTipo(), c.getValor());
    }
}
