package com.petshop.repository;

import com.petshop.entity.Raca;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RacaRepository extends JpaRepository<Raca, Long> {
    boolean existsByDescricao(String descricao);
}
