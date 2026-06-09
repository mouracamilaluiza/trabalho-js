# Trabalho JS - Serviço de Pagamento

[![CI - Testes Automatizados](https://github.com/mouracamilaluiza/trabalho-js/actions/workflows/ci.yml/badge.svg)](https://github.com/mouracamilaluiza/trabalho-js/actions/workflows/ci.yml)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![Mocha](https://img.shields.io/badge/Testes-Mocha-8D6748)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)

Projeto em JavaScript para simular um serviço de pagamento, com testes automatizados, geração de relatórios e pipeline de integração contínua no GitHub Actions.

## Visão Geral

O projeto implementa uma classe `ServicoDePagamento`, responsável por registrar pagamentos e consultar o último pagamento realizado.

| Recurso | Descrição |
| --- | --- |
| Pagamento | Registra código de barras, empresa, valor e categoria. |
| Categoria | Define `cara` para valores acima de `100.00` e `padrão` para valores até `100.00`. |
| Histórico | Armazena os pagamentos realizados em memória. |
| Consulta | Retorna apenas o último pagamento registrado. |
| Testes | Valida os principais cenários com Mocha e Node Assert. |
| Relatórios | Gera relatório em JSON e HTML. |

## Links Rápidos

| Item | Link |
| --- | --- |
| Pipeline | [Acessar GitHub Actions](https://github.com/mouracamilaluiza/trabalho-js/actions/workflows/ci.yml) |
| Workflow | [.github/workflows/ci.yml](.github/workflows/ci.yml) |
| Testes | [test/ServicoDePagamento.test.js](test/ServicoDePagamento.test.js) |
| Gerador de relatório | [scripts/gerar-relatorio.js](scripts/gerar-relatorio.js) |

## Estrutura

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── scripts/
│   └── gerar-relatorio.js
├── src/
│   └── ServicoDePagamento.js
├── test/
│   └── ServicoDePagamento.test.js
├── package.json
├── relatorio-testes.html
└── relatorio-testes.json
```

## Comandos

| Comando | Descrição |
| --- | --- |
| `npm install` | Instala as dependências do projeto. |
| `npm run lint` | Verifica a sintaxe dos arquivos JavaScript com `node --check`. |
| `npm test` | Executa os testes automatizados com Mocha. |
| `npm run report` | Executa os testes e gera os relatórios `JSON` e `HTML`. |

## Relatórios de Teste

Ao executar:

```bash
npm run report
```

São gerados dois arquivos na raiz do projeto:

| Arquivo | Uso |
| --- | --- |
| `relatorio-testes.json` | Relatório estruturado para leitura automatizada. |
| `relatorio-testes.html` | Relatório visual para abrir no navegador, com resumo, status e passos verificados por cenário. |

## Pipeline de Integração Contínua

A pipeline foi criada com GitHub Actions no arquivo `.github/workflows/ci.yml`.

Ela é executada em três situações:

| Gatilho | Evento |
| --- | --- |
| Push | Executa ao enviar alterações para `main` ou `master`. |
| Manual | Executa pelo botão `Run workflow`. |
| Agendado | Executa toda segunda-feira às 09:00 UTC. |

Etapas executadas:

1. Baixa o código do repositório.
2. Configura o Node.js.
3. Instala as dependências com `npm ci`.
4. Executa o lint com `npm run lint`.
5. Executa os testes com `npm test`.
6. Gera os relatórios com `npm run report`.
7. Publica os relatórios como artifact.
8. Envia os relatórios por e-mail.

## Como Acessar o Relatório

1. Acesse a [página da pipeline no GitHub Actions](https://github.com/mouracamilaluiza/trabalho-js/actions/workflows/ci.yml).
2. Abra uma execução da workflow `CI - Testes Automatizados`.
3. Baixe o artifact chamado `relatorio-testes`.
4. Extraia o arquivo baixado.
5. Abra `relatorio-testes.html` no navegador.

O relatório é gerado, publicado e enviado por e-mail mesmo quando os testes falham, porque essas etapas usam `if: always()`.

## Envio por E-mail

Para enviar o relatório por e-mail, a pipeline usa SMTP com secrets protegidos no GitHub Actions.

Cadastre os secrets em:

`Settings > Secrets and variables > Actions > Repository secrets`

| Secret | Valor esperado |
| --- | --- |
| `SMTP_SERVER` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USERNAME` | E-mail usado para envio. |
| `SMTP_PASSWORD` | Senha de app do Gmail, sem espaços. |
| `EMAIL_TO` | E-mail que receberá o relatório. |

O e-mail enviado contém `relatorio-testes.html` e `relatorio-testes.json` como anexos.

