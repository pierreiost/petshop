export interface LoginRequest {
  cpf: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  cpf: string;
  nome: string;
  perfil: 'ADMIN' | 'CLIENTE';
}

export interface Usuario {
  cpf: string;
  nome: string;
  perfil: 'ADMIN' | 'CLIENTE';
  foto?: string;
}

export interface UsuarioRequest {
  cpf: string;
  nome: string;
  perfil: 'ADMIN' | 'CLIENTE';
  senha: string;
}

export interface Endereco {
  id?: number;
  logradouro: string;
  cidade: string;
  bairro: string;
  complemento?: string;
  tag?: string;
}

export interface Contato {
  id?: number;
  tag?: string;
  tipo: 'EMAIL' | 'TELEFONE';
  valor: string;
}

export interface Cliente {
  id?: number;
  nome: string;
  cpf?: string;
  dataCadastro?: string;
  foto?: string;
  enderecos?: Endereco[];
  contatos?: Contato[];
}

export interface Raca {
  id?: number;
  descricao: string;
}

export interface Pet {
  id?: number;
  nome: string;
  dataNascimento?: string;
  raca: Raca;
  clienteId?: number;
  clienteNome?: string;
  foto?: string;
}

export interface PetRequest {
  nome: string;
  racaId: number;
  dataNascimento?: string;
  foto?: string;
}

export interface Atendimento {
  id?: number;
  descricao: string;
  valor: number;
  data?: string;
  petId?: number;
  petNome?: string;
  clienteId?: number;
  clienteNome?: string;
}
