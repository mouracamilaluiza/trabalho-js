# Trabalho JS - Serviço de Pagamento

Projeto em JavaScript com uma classe para realizar pagamentos e consultar o último pagamento realizado.

## Funcionalidades

- Realizar pagamento com código de barras, empresa e valor.
- Armazenar os pagamentos em uma lista.
- Definir a categoria do pagamento:
  - `cara` para valores maiores que `100.00`;
  - `padrão` para valores menores ou iguais a `100.00`.
- Consultar apenas o último pagamento realizado.

## Estrutura

```text
src/
  ServicoDePagamento.js

test/
  ServicoDePagamento.test.js
```

## Instalação

```bash
npm install
```

## Executar os testes

```bash
npm test
```

## Gerar relatório dos testes

```bash
npx mocha --reporter json > relatorio-testes.json
```

## Tecnologias

- Node.js
- Mocha
- Node Assert
