import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, Contato, Endereco, Pet, PetRequest, Atendimento, Raca, Usuario, UsuarioRequest } from '../../models';

const BASE = '/api/v1';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Cliente[]> { return this.http.get<Cliente[]>(`${BASE}/clientes`); }
  buscar(id: number): Observable<Cliente> { return this.http.get<Cliente>(`${BASE}/clientes/${id}`); }
  meuPerfil(): Observable<Cliente> { return this.http.get<Cliente>(`${BASE}/clientes/meu-perfil`); }
  criar(data: Partial<Cliente>): Observable<Cliente> { return this.http.post<Cliente>(`${BASE}/clientes`, data); }
  atualizar(id: number, data: Partial<Cliente>): Observable<Cliente> { return this.http.put<Cliente>(`${BASE}/clientes/${id}`, data); }
  deletar(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/clientes/${id}`); }

  listarEnderecos(clienteId: number): Observable<Endereco[]> { return this.http.get<Endereco[]>(`${BASE}/clientes/${clienteId}/enderecos`); }
  adicionarEndereco(clienteId: number, data: Endereco): Observable<Endereco> { return this.http.post<Endereco>(`${BASE}/clientes/${clienteId}/enderecos`, data); }
  atualizarEndereco(clienteId: number, enderecoId: number, data: Endereco): Observable<Endereco> { return this.http.put<Endereco>(`${BASE}/clientes/${clienteId}/enderecos/${enderecoId}`, data); }
  deletarEndereco(clienteId: number, enderecoId: number): Observable<void> { return this.http.delete<void>(`${BASE}/clientes/${clienteId}/enderecos/${enderecoId}`); }

  listarContatos(clienteId: number): Observable<Contato[]> { return this.http.get<Contato[]>(`${BASE}/clientes/${clienteId}/contatos`); }
  adicionarContato(clienteId: number, data: Contato): Observable<Contato> { return this.http.post<Contato>(`${BASE}/clientes/${clienteId}/contatos`, data); }
  atualizarContato(clienteId: number, contatoId: number, data: Contato): Observable<Contato> { return this.http.put<Contato>(`${BASE}/clientes/${clienteId}/contatos/${contatoId}`, data); }
  deletarContato(clienteId: number, contatoId: number): Observable<void> { return this.http.delete<void>(`${BASE}/clientes/${clienteId}/contatos/${contatoId}`); }
}

@Injectable({ providedIn: 'root' })
export class PetService {
  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Pet[]> { return this.http.get<Pet[]>(`${BASE}/pets`); }
  listarPorCliente(clienteId: number): Observable<Pet[]> { return this.http.get<Pet[]>(`${BASE}/clientes/${clienteId}/pets`); }
  buscar(id: number): Observable<Pet> { return this.http.get<Pet>(`${BASE}/pets/${id}`); }
  criar(clienteId: number, data: PetRequest): Observable<Pet> { return this.http.post<Pet>(`${BASE}/clientes/${clienteId}/pets`, data); }
  atualizar(id: number, data: PetRequest): Observable<Pet> { return this.http.put<Pet>(`${BASE}/pets/${id}`, data); }
  deletar(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/pets/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Atendimento[]> { return this.http.get<Atendimento[]>(`${BASE}/atendimentos`); }
  listarPorPet(petId: number): Observable<Atendimento[]> { return this.http.get<Atendimento[]>(`${BASE}/pets/${petId}/atendimentos`); }
  listarPorCliente(clienteId: number): Observable<Atendimento[]> { return this.http.get<Atendimento[]>(`${BASE}/clientes/${clienteId}/atendimentos`); }
  criar(petId: number, data: Partial<Atendimento>): Observable<Atendimento> { return this.http.post<Atendimento>(`${BASE}/pets/${petId}/atendimentos`, data); }
  atualizar(id: number, data: Partial<Atendimento>): Observable<Atendimento> { return this.http.put<Atendimento>(`${BASE}/atendimentos/${id}`, data); }
  deletar(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/atendimentos/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class RacaApiService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Raca[]> { return this.http.get<Raca[]>(`${BASE}/racas`); }
  criar(data: Raca): Observable<Raca> { return this.http.post<Raca>(`${BASE}/racas`, data); }
  atualizar(id: number, data: Raca): Observable<Raca> { return this.http.put<Raca>(`${BASE}/racas/${id}`, data); }
  deletar(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/racas/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class UsuarioApiService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> { return this.http.get<Usuario[]>(`${BASE}/usuarios`); }
  criar(data: UsuarioRequest): Observable<Usuario> { return this.http.post<Usuario>(`${BASE}/usuarios`, data); }
  atualizar(cpf: string, data: UsuarioRequest): Observable<Usuario> { return this.http.put<Usuario>(`${BASE}/usuarios/${cpf}`, data); }
  deletar(cpf: string): Observable<void> { return this.http.delete<void>(`${BASE}/usuarios/${cpf}`); }
}
