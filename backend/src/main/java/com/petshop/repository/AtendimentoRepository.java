package com.petshop.repository;

import com.petshop.entity.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {
    List<Atendimento> findByPetId(Long petId);
    List<Atendimento> findByPetClienteId(Long clienteId);
}
