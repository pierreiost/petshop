Sistema de Gestão para Petshop
Este é um projeto de sistema para controle de atendimentos de um petshop. Ele é dividido em uma API no backend e uma interface no frontend.

O sistema possui dois tipos de acesso:

Admin: Pode incluir, excluir, alterar e visualizar qualquer cadastro do sistema (clientes, pets, raças e atendimentos).
Cliente: Pode visualizar e alterar apenas os seus próprios registros e os registros dos seus pets.
Tecnologias utilizadas
Backend: Java 17 e Spring Boot.
Banco de dados: H2. É um banco que roda na memória, escolhido para facilitar a execução do projeto sem precisar instalar e configurar um banco de dados externo.
Segurança: Spring Security com tokens JWT para autenticação e controle de permissões.
Testes: JUnit e Mockito para os testes unitários da API.
Frontend: Angular.
Como executar o projeto
Você vai precisar rodar o backend e o frontend em terminais separados.

Executando o Backend
É necessário ter o Java 17 e o Maven instalados na sua máquina.
Pelo terminal, acesse a pasta do backend do projeto.
Execute o comando abaixo: mvn spring-boot:run
A API vai iniciar e ficará disponível na porta 8080 (http://localhost:8080). O banco de dados será criado automaticamente ao rodar este comando.

Executando o Frontend
É necessário ter o Node.js instalado.
Pelo terminal, acesse a pasta do frontend do projeto.
Execute o comando abaixo para baixar as dependências: npm install
Em seguida, execute o comando para iniciar a tela: npm start
A interface ficará disponível na porta 4200 (http://localhost:4200).

Documentação da API
A documentação dos endpoints foi feita com Swagger. Para visualizar as rotas e testar as requisições, inicie o backend e acesse o link abaixo no seu navegador: http://localhost:8080/swagger-ui.html