# Estrutura de testes

Organizacao por dominio e camada para facilitar manutencao:

- beneficiario/
  - controller/
  - service/
  - model/
- categoria/
  - controller/
  - service/
  - model/
- equipamento/
- emprestimo/
- setup.js
- seed.js

Convencao sugerida:

- `<dominio>.<camada>.test.js`
- manter dados de apoio compartilhados em `setup.js` e `seed.js`
