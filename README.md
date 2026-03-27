# App

GymPass

## Requisitos Funcionais

- [x] Deve ser possivel se cadastrar;
- [x] Deve ser possivel se autenticar;
- [x] Deve ser possivel obter o perfil de um usuario logado;
- [x] Deve ser possivel obter o numero de check-ins realizados pelo usuario;
- [x] Deve ser possivel o usuario obter seu historico de check-ins;
- [ ] Deve ser possivel o usuario buscar academias proximas;
- [ ] Deve ser possivel o usuario buscar academias pelo nome;
- [x] Deve ser possivel o usuario realizar check-in em uma academia;
- [ ] Deve ser possivel validar o check-in de um usuario;
- [x] Deve ser possivel cadastrar uma academia;

## Regras de Negocio

- [x] O usuario nao deve poder se cadastrar com email duplicado;
- [x] O usuario nao pode fazer dois check-ins no mesmo dia;
- [x] O usuario nao pode realizar check-in se nao estiver perto (100m) da academia;
- [ ] O check-in so pode ser realizado ate 20 mins apos criado;
- [ ] O check-in so pode ser validado por administradores;
- [ ] A academia so pode ser cadastrada por adminstradores;

## Requisitos nao funcionais

- [x] A senha do usuario precisa estar criptografada;
- [x] Os dados da aplicacao precisam estar persistidos em um banco PostgresSQL;
- [x] Todas as listas de dados precisam estar paginadas com ate 20 itens por pagina;
- [ ] O usuario precisa ser identifcado por um JWT;
