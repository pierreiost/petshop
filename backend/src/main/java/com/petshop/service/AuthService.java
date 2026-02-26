package com.petshop.service;

import com.petshop.dto.LoginRequest;
import com.petshop.dto.LoginResponse;
import com.petshop.entity.Usuario;
import com.petshop.repository.UsuarioRepository;
import com.petshop.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authManager;
    private final JwtTokenProvider tokenProvider;
    private final UsuarioRepository usuarioRepository;

    public AuthService(AuthenticationManager authManager, JwtTokenProvider tokenProvider,
                       UsuarioRepository usuarioRepository) {
        this.authManager = authManager;
        this.tokenProvider = tokenProvider;
        this.usuarioRepository = usuarioRepository;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.cpf(), request.senha()));

        String token = tokenProvider.gerarToken(auth);

        Usuario usuario = usuarioRepository.findByCpf(request.cpf()).orElseThrow();

        return new LoginResponse(token, usuario.getCpf(), usuario.getNome(), usuario.getPerfil().name());
    }
}
