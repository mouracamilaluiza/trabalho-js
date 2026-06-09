# Trabalho JS - Serviço de Pagamento

[![CI - Testes Automatizados](https://github.com/mouracamilaluiza/trabalho-js/actions/workflows/ci.yml/badge.svg)](https://github.com/mouracamilaluiza/trabalho-js/actions/workflows/ci.yml)

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

.github/
  workflows/
    ci.yml
```

## Instalação

```bash
npm install
```

## Executar os testes localmente

```bash
npm test
```

## Gerar relatório dos testes localmente

```bash
npm run report
```

O comando acima executa o Mocha com o reporter JSON e gera o arquivo `relatorio-testes.json`.

## Pipeline de integração contínua

A pipeline foi criada com GitHub Actions no arquivo `.github/workflows/ci.yml`.

- [Acessar a página da pipeline no GitHub Actions](https://github.com/mouracamilaluiza/trabalho-js/actions/workflows/ci.yml)

Ela contempla os requisitos:

- Execução por `push` nas branches `main` e `master`.
- Execução manual pelo botão `Run workflow`, usando o evento `workflow_dispatch`.
- Execução agendada toda segunda-feira às 09:00 UTC, usando `schedule` com cron.
- Instalação limpa das dependências com `npm ci`.
- Execução dos testes automatizados com `npm test`.
- Geração do relatório de testes com `npm run report`.
- Publicação do arquivo `relatorio-testes.json` como artifact da pipeline.

## Como acessar o relatório no GitHub Actions

1. Acesse a [página da pipeline no GitHub Actions](https://github.com/mouracamilaluiza/trabalho-js/actions/workflows/ci.yml).
2. Abra a execução da workflow `CI - Testes Automatizados`.
3. Ao final da página da execução, baixe o artifact chamado `relatorio-testes`.

O relatório também é gerado quando os testes falham, porque as etapas de geração e publicação usam `if: always()`.

## Conceitos utilizados

- `workflow`: arquivo YAML que define a automação executada pelo GitHub Actions.
- `on`: define os eventos que disparam a pipeline, como `push`, `workflow_dispatch` e `schedule`.
- `job`: grupo de etapas executadas em um ambiente virtual.
- `runner`: máquina disponibilizada pelo GitHub para executar a pipeline. Neste projeto foi usado `ubuntu-latest`.
- `step`: cada ação ou comando executado dentro do job.
- `actions/checkout`: action usada para baixar o código do repositório no runner.
- `actions/setup-node`: action usada para configurar a versão do Node.js.
- `artifact`: arquivo gerado durante a pipeline e armazenado para consulta posterior.
- `cron`: sintaxe usada para configurar execuções agendadas.

## Tecnologias

- Node.js
- Mocha
- Node Assert
- GitHub Actions
