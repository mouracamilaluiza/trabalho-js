# Trabalho JS - Serviço de Pagamento

[![CI - Testes Automatizados](https://github.com/mouracamilaluiza/trabalho-js/actions/workflows/ci.yml/badge.svg)](https://github.com/mouracamilaluiza/trabalho-js/actions/workflows/ci.yml)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/E2E-Playwright-2EAD33?logo=playwright&logoColor=white)
![Allure](https://img.shields.io/badge/Relatorio-Allure-FD6A02)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)

Projeto em JavaScript para simular um serviço de pagamento, com testes automatizados, geração de relatórios e pipeline de integração contínua no GitHub Actions.

## Visão Geral

O projeto implementa uma classe `ServicoDePagamento`, responsável por registrar pagamentos e consultar o último pagamento realizado.

| Recurso    | Descrição                                                                          |
| ---------- | ---------------------------------------------------------------------------------- |
| Pagamento  | Registra código de barras, empresa, valor e categoria.                             |
| Categoria  | Define `cara` para valores acima de `100.00` e `padrão` para valores até `100.00`. |
| Histórico  | Armazena os pagamentos realizados em memória.                                      |
| Consulta   | Retorna apenas o último pagamento registrado.                                      |
| Testes     | Valida os principais cenários com Playwright Test.                                 |
| Front-end  | Disponibiliza uma tela simples para registrar e visualizar pagamentos.             |
| Relatórios | Gera relatório Allure e relatório HTML nativo do Playwright como apoio local.      |

## Links Rápidos

| Item                  | Link                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| Pipeline              | [Acessar GitHub Actions](https://github.com/mouracamilaluiza/trabalho-js/actions/workflows/ci.yml) |
| Relatório Allure      | [Acessar GitHub Pages](https://mouracamilaluiza.github.io/trabalho-js/)                            |
| Workflow              | [.github/workflows/ci.yml](.github/workflows/ci.yml)                                               |
| Testes unitários      | [test/unit](test/unit)                                                                             |
| Testes E2E            | [test/e2e/frontend.spec.js](test/e2e/frontend.spec.js)                                             |
| Interface             | [public/index.html](public/index.html)                                                             |
| Serviço compartilhado | [shared/services/ServicoDePagamento.js](shared/services/ServicoDePagamento.js)                     |
| Domínio               | [shared/domain/Pagamento.js](shared/domain/Pagamento.js)                                           |

## Estrutura

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── shared/
│   ├── domain/
│   │   └── Pagamento.js
│   ├── services/
│   │   └── ServicoDePagamento.js
│   └── utils/
│       └── escape-html.js
├── test/
│   ├── e2e/
│   │   ├── pages/
│   │   │   └── PagamentoPage.js
│   │   └── frontend.spec.js
│   └── unit/
│       ├── Pagamento.test.js
│       └── ServicoDePagamento.test.js
├── playwright.config.js
└── package.json
```

## Comandos

| Comando                   | Descrição                                                     |
| ------------------------- | ------------------------------------------------------------- |
| `npm install`             | Instala as dependências do projeto.                           |
| `npm run lint`            | Verifica a formatação do projeto com Prettier.                |
| `npm run format`          | Formata os arquivos do projeto com Prettier.                  |
| `npm run test:unit`       | Executa os testes unitários com Playwright.                   |
| `npm run test:e2e`        | Executa os testes de front com Playwright.                    |
| `npm test`                | Executa os testes unitários e E2E.                            |
| `npm run allure:generate` | Gera o relatório HTML do Allure a partir de `allure-results`. |
| `npm run allure:open`     | Abre o relatório Allure gerado localmente.                    |

Para gerar ou abrir o relatório Allure localmente, é necessário ter Java instalado e disponível no `PATH` ou configurar a variável `JAVA_HOME`.

## Arquitetura

A regra de negócio do pagamento fica em `shared/domain/Pagamento.js`, onde estão as decisões de domínio, como a classificação da categoria do pagamento.

O arquivo `shared/services/ServicoDePagamento.js` usa essa camada de domínio para registrar e consultar pagamentos, sem repetir regras. Ele também é o ponto de entrada Node.js definido no `main` do `package.json`. Já a interface em `public/index.html` carrega os arquivos compartilhados diretamente.

Os testes seguem uma única convenção de pasta: `test/unit` para testes unitários e `test/e2e` para testes de front, ambos executados com Playwright Test.

No `playwright.config.js`, os testes unitários rodam uma única vez no projeto `unit`. Os testes E2E rodam em paralelo nos projetos `chromium`, `firefox` e `mobile-chromium`, validando desktop e mobile.

Os testes E2E usam Page Object em `test/e2e/pages/PagamentoPage.js` para concentrar navegação, seletores e ações da tela de pagamento.

## Interface Web

O projeto possui uma interface simples em `public/index.html` para registrar pagamentos pelo navegador.

Funcionalidades da tela:

- Cadastro de pagamento com código de barras, empresa e valor.
- Validação dos campos obrigatórios.
- Classificação automática da categoria do pagamento.
- Exibição do último pagamento realizado.
- Listagem do histórico de pagamentos cadastrados na sessão.

Para abrir localmente, acesse o arquivo `public/index.html` no navegador.

## Relatório de Teste

Ao executar:

```bash
npm test
npm run allure:generate
```

São gerados os relatórios:

| Arquivo                        | Uso                                                      |
| ------------------------------ | -------------------------------------------------------- |
| `allure-report/index.html`     | Relatório HTML do Allure para testes unitários e E2E.    |
| `playwright-report/index.html` | Relatório HTML nativo do Playwright, mantido como apoio. |

Para abrir o Allure localmente:

```bash
npm run allure:open
```

Quando um teste E2E falha, o Playwright gera screenshot e trace automaticamente, conforme configurado em `playwright.config.js`.

## Pipeline de Integração Contínua

A pipeline foi criada com GitHub Actions no arquivo `.github/workflows/ci.yml`.

Ela é executada em três situações:

| Gatilho  | Evento                                                |
| -------- | ----------------------------------------------------- |
| Push     | Executa ao enviar alterações para `main` ou `master`. |
| Manual   | Executa pelo botão `Run workflow`.                    |
| Agendado | Executa toda segunda-feira às 09:00 UTC.              |

Etapas executadas:

1. Baixa o código do repositório.
2. Configura o Node.js.
3. Configura o Java usado pelo Allure.
4. Instala as dependências com `npm ci`.
5. Instala os navegadores Chromium e Firefox usados pelo Playwright.
6. Executa o lint com `npm run lint`.
7. Executa os testes com `npm test`.
8. Gera o relatório Allure.
9. Publica o relatório Allure no GitHub Pages.
10. Publica o relatório Allure como artifact.
11. Envia um e-mail com o status, o link da execução e o link direto do Allure.

## Como Acessar o Relatório

O relatório Allure é publicado no GitHub Pages pela própria pipeline:

[https://mouracamilaluiza.github.io/trabalho-js/](https://mouracamilaluiza.github.io/trabalho-js/)

O link direto também é exibido na execução da workflow e enviado por e-mail.

Também é possível baixar o artifact:

1. Acesse a [página da pipeline no GitHub Actions](https://github.com/mouracamilaluiza/trabalho-js/actions/workflows/ci.yml).
2. Abra uma execução da workflow `CI - Testes Automatizados`.
3. Baixe o artifact chamado `allure-report`.
4. Extraia o arquivo baixado.
5. Abra `allure-report/index.html` no navegador.

Para a publicação no GitHub Pages funcionar, configure o repositório em `Settings > Pages` usando `GitHub Actions` como source.

## Envio por E-mail

Para enviar o relatório por e-mail, a pipeline usa SMTP com secrets protegidos no GitHub Actions.

Cadastre os secrets em:

`Settings > Secrets and variables > Actions > Repository secrets`

| Secret          | Valor esperado                      |
| --------------- | ----------------------------------- |
| `SMTP_SERVER`   | `smtp.gmail.com`                    |
| `SMTP_PORT`     | `587`                               |
| `SMTP_USERNAME` | E-mail usado para envio.            |
| `SMTP_PASSWORD` | Senha de app do Gmail, sem espaços. |
| `EMAIL_TO`      | E-mail que receberá o relatório.    |

O e-mail enviado contém o status da execução, o link direto para a página da pipeline e o link direto do relatório Allure publicado no GitHub Pages.
