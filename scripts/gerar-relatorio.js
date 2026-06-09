const fs = require("fs");
const os = require("os");
const path = require("path");
const Mocha = require("mocha");

const rootDir = path.resolve(__dirname, "..");
const testDir = path.join(rootDir, "test");
const jsonPath = path.join(rootDir, "relatorio-testes.json");
const htmlPath = path.join(rootDir, "relatorio-testes.html");
const packageJson = require(path.join(rootDir, "package.json"));

const mocha = new Mocha({ color: false });

for (const file of fs.readdirSync(testDir)) {
  if (file.endsWith(".js")) {
    mocha.addFile(path.join(testDir, file));
  }
}

const startedAt = new Date();
const tests = [];
const passes = [];
const failures = [];
const pending = [];

const stepsByTestTitle = {
  "Front do ServicoDePagamento deve validar e normalizar os dados do formulário": [
    "Receber dados simulando o preenchimento do formulário.",
    "Remover espaços extras do código de barras e da empresa.",
    "Converter o valor informado para número.",
    "Validar se os dados normalizados estão corretos.",
  ],
  "Front do ServicoDePagamento deve rejeitar valor menor ou igual a zero": [
    "Receber dados simulando um formulário com valor inválido.",
    "Executar a validação dos dados do pagamento.",
    "Verificar se uma mensagem de erro é emitida para valor menor ou igual a zero.",
  ],
  "Front do ServicoDePagamento deve formatar valores em reais": [
    "Receber um valor numérico.",
    "Formatar o valor usando o padrão monetário brasileiro.",
    "Validar se o valor formatado contém centavos no formato esperado.",
  ],
  "Front do ServicoDePagamento deve escapar textos antes de renderizar HTML": [
    "Receber um texto contendo marcação HTML.",
    "Executar o escape dos caracteres especiais.",
    "Validar se o texto final pode ser renderizado sem interpretar tags indevidas.",
  ],
  "Front do ServicoDePagamento deve renderizar um card de pagamento com categoria": [
    "Receber os dados de um pagamento realizado.",
    "Gerar o HTML do card de pagamento.",
    "Validar se empresa, código, valor e categoria aparecem no card.",
  ],
  "ServicoDePagamento deve realizar pagamento com categoria cara quando o valor for maior que 100.00": [
    "Criar uma instância do serviço de pagamento.",
    "Executar o pagamento com código de barras, empresa e valor 156.87.",
    "Verificar se o pagamento retornado contém os dados informados.",
    "Validar se a categoria calculada foi `cara`.",
  ],
  "ServicoDePagamento deve realizar pagamento com categoria padrão quando o valor for menor ou igual a 100.00": [
    "Criar uma instância do serviço de pagamento.",
    "Executar o pagamento com valor igual a 100.00.",
    "Verificar se o pagamento retornado contém os dados informados.",
    "Validar se a categoria calculada foi `padrão`.",
  ],
  "ServicoDePagamento deve realizar pagamento com categoria cara quando o valor for 100.01": [
    "Criar uma instância do serviço de pagamento.",
    "Executar o pagamento com valor 100.01.",
    "Verificar se o pagamento retornado contém os dados informados.",
    "Validar se a categoria calculada foi `cara`.",
  ],
  "ServicoDePagamento deve realizar pagamento com categoria padrão quando o valor for menor que 100.00": [
    "Criar uma instância do serviço de pagamento.",
    "Executar o pagamento com valor 99.99.",
    "Verificar se o pagamento retornado contém os dados informados.",
    "Validar se a categoria calculada foi `padrão`.",
  ],
  "ServicoDePagamento deve armazenar os pagamentos realizados na lista de pagamentos": [
    "Criar uma instância do serviço de pagamento.",
    "Executar o primeiro pagamento.",
    "Executar o segundo pagamento.",
    "Validar se a lista de pagamentos contém os dois registros na ordem correta.",
  ],
  "ServicoDePagamento deve consultar apenas o ultimo pagamento realizado": [
    "Criar uma instância do serviço de pagamento.",
    "Executar um primeiro pagamento.",
    "Executar um segundo pagamento.",
    "Consultar o último pagamento registrado.",
    "Validar se o retorno corresponde ao segundo pagamento.",
  ],
  "ServicoDePagamento deve retornar null quando nenhum pagamento tiver sido realizado": [
    "Criar uma instância do serviço de pagamento.",
    "Consultar o último pagamento sem registrar pagamentos antes.",
    "Validar se o retorno é `null`.",
  ],
};

function serializeTest(test, err) {
  const fullTitle = test.fullTitle();
  const suite = test.parent ? test.parent.title : "Sem suíte";

  return {
    title: test.title,
    fullTitle,
    suite,
    type: suite.toLowerCase().includes("front") ? "front" : "servico",
    file: test.file,
    duration: test.duration || 0,
    currentRetry: test.currentRetry(),
    speed: test.speed,
    steps: stepsByTestTitle[fullTitle] || [],
    err: err
      ? {
          message: err.message,
          stack: err.stack,
        }
      : {},
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getExecutorName() {
  return (
    process.env.GITHUB_ACTOR ||
    process.env.GIT_AUTHOR_NAME ||
    process.env.USERNAME ||
    process.env.USER ||
    os.userInfo().username ||
    "Executor local"
  );
}

function summarizeTests(testsToSummarize) {
  return testsToSummarize.reduce(
    (summary, test) => {
      const failed = Boolean(test.err && test.err.message);

      summary.tests += 1;
      summary.duration += test.duration || 0;

      if (failed) {
        summary.failures += 1;
      } else {
        summary.passes += 1;
      }

      return summary;
    },
    { tests: 0, passes: 0, failures: 0, duration: 0 }
  );
}

function buildHtml(report) {
  const statusClass = report.stats.failures > 0 ? "failed" : "passed";
  const statusText = report.stats.failures > 0 ? "Falhou" : "Passou";
  const generatedAt = new Date(report.stats.end).toLocaleString("pt-BR");
  const groupedTests = [
    {
      key: "front",
      title: "Testes de Front-end",
      description: "Validações da camada visual, formatação, renderização e tratamento de dados da interface.",
      tests: report.tests.filter((test) => test.type === "front"),
    },
    {
      key: "servico",
      title: "Testes do Serviço de Pagamento",
      description: "Validações da regra de negócio, registro de pagamentos, categoria e consulta do último pagamento.",
      tests: report.tests.filter((test) => test.type !== "front"),
    },
  ].filter((group) => group.tests.length > 0);

  const renderRows = (testsToRender) =>
    testsToRender
      .map((test) => {
      const failed = Boolean(test.err && test.err.message);
      const steps = test.steps.length
        ? `<ol class="steps">${test.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`
        : "<span class=\"muted\">Nenhum passo detalhado cadastrado.</span>";

      return `
        <tr>
          <td><span class="status ${failed ? "failed" : "passed"}">${failed ? "Falhou" : "Passou"}</span></td>
          <td>${escapeHtml(test.fullTitle)}</td>
          <td>${escapeHtml(test.duration)} ms</td>
        </tr>
        <tr class="steps-row">
          <td></td>
          <td colspan="2">
            <strong>Passos verificados</strong>
            ${steps}
          </td>
        </tr>
        ${
          failed
            ? `<tr class="error-row"><td></td><td colspan="2"><pre>${escapeHtml(test.err.stack || test.err.message)}</pre></td></tr>`
            : ""
        }`;
      })
      .join("");

  const sections = groupedTests
    .map((group) => {
      const summary = summarizeTests(group.tests);

      return `
        <section class="suite-section">
          <div class="suite-header">
            <div>
              <p class="eyebrow">${escapeHtml(group.key)}</p>
              <h2>${escapeHtml(group.title)}</h2>
              <p>${escapeHtml(group.description)}</p>
            </div>
            <div class="suite-summary">
              <span>${summary.tests} testes</span>
              <span>${summary.passes} passaram</span>
              <span>${summary.failures} falharam</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Teste</th>
                <th>Duração</th>
              </tr>
            </thead>
            <tbody>
              ${renderRows(group.tests)}
            </tbody>
          </table>
        </section>`;
    })
    .join("");

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Relatório de Testes - ${escapeHtml(report.project.name)}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f4f7fb;
      --panel: #ffffff;
      --text: #172033;
      --muted: #5d677a;
      --border: #d9deea;
      --accent: #2454a6;
      --accent-bg: #eef4ff;
      --ok: #147a45;
      --ok-bg: #e8f6ef;
      --fail: #b42318;
      --fail-bg: #fdecec;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.5;
    }

    main {
      width: min(1120px, calc(100% - 32px));
      margin: 32px auto;
    }

    header {
      margin-bottom: 24px;
      padding: 24px;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
    }

    h1 {
      margin: 0 0 8px;
      font-size: 34px;
      letter-spacing: 0;
    }

    h2 {
      margin: 0 0 6px;
      font-size: 22px;
      letter-spacing: 0;
    }

    p {
      margin: 0;
    }

    .eyebrow {
      margin-bottom: 8px;
      color: var(--accent);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    .meta {
      color: var(--muted);
      margin: 0;
    }

    .muted {
      color: var(--muted);
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      margin: 24px 0;
    }

    .details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 10px 18px;
      margin-top: 20px;
      padding-top: 18px;
      border-top: 1px solid var(--border);
    }

    .detail {
      display: grid;
      gap: 2px;
    }

    .detail span {
      color: var(--muted);
      font-size: 13px;
    }

    .detail strong {
      font-size: 15px;
    }

    .metric {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
    }

    .metric strong {
      display: block;
      font-size: 28px;
      line-height: 1;
      margin-bottom: 6px;
    }

    .metric span {
      color: var(--muted);
      font-size: 14px;
    }

    .result {
      color: ${statusClass === "passed" ? "var(--ok)" : "var(--fail)"};
    }

    .suite-section {
      margin-top: 18px;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
    }

    .suite-header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 18px;
      border-bottom: 1px solid var(--border);
    }

    .suite-header p:not(.eyebrow) {
      color: var(--muted);
    }

    .suite-summary {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-end;
      gap: 8px;
      min-width: 220px;
    }

    .suite-summary span {
      border-radius: 999px;
      padding: 5px 10px;
      background: var(--accent-bg);
      color: var(--accent);
      font-size: 13px;
      font-weight: 700;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 14px 16px;
      text-align: left;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }

    th {
      color: var(--muted);
      font-size: 13px;
      text-transform: uppercase;
    }

    .status {
      display: inline-block;
      min-width: 72px;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 13px;
      font-weight: 700;
      text-align: center;
    }

    .status.passed {
      color: var(--ok);
      background: var(--ok-bg);
    }

    .status.failed {
      color: var(--fail);
      background: var(--fail-bg);
    }

    pre {
      margin: 0;
      white-space: pre-wrap;
      color: var(--fail);
      font-family: Consolas, Monaco, monospace;
      font-size: 13px;
    }

    .error-row td {
      background: #fff7f7;
    }

    .steps-row td {
      background: #fbfcff;
    }

    .steps-row strong {
      display: block;
      margin-bottom: 8px;
    }

    .steps {
      margin: 0;
      padding-left: 20px;
      color: var(--muted);
    }

    .steps li + li {
      margin-top: 4px;
    }

    @media (max-width: 720px) {
      .suite-header {
        display: grid;
      }

      .suite-summary {
        justify-content: flex-start;
        min-width: 0;
      }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="eyebrow">Relatório automatizado</p>
      <h1>${escapeHtml(report.project.displayName)}</h1>
      <p class="meta">Resultado da execução dos testes automatizados do projeto.</p>

      <div class="details">
        <div class="detail"><span>Projeto</span><strong>${escapeHtml(report.project.name)}</strong></div>
        <div class="detail"><span>Versão</span><strong>${escapeHtml(report.project.version)}</strong></div>
        <div class="detail"><span>Executor</span><strong>${escapeHtml(report.execution.author)}</strong></div>
        <div class="detail"><span>Ambiente</span><strong>${escapeHtml(report.execution.environment)}</strong></div>
        <div class="detail"><span>Node.js</span><strong>${escapeHtml(report.execution.nodeVersion)}</strong></div>
        <div class="detail"><span>Gerado em</span><strong>${escapeHtml(generatedAt)}</strong></div>
      </div>
    </header>

    <div class="summary">
      <div class="metric"><strong class="result">${statusText}</strong><span>Resultado</span></div>
      <div class="metric"><strong>${report.stats.tests}</strong><span>Total de testes</span></div>
      <div class="metric"><strong>${report.stats.passes}</strong><span>Passaram</span></div>
      <div class="metric"><strong>${report.stats.failures}</strong><span>Falharam</span></div>
      <div class="metric"><strong>${report.stats.duration} ms</strong><span>Duração</span></div>
    </div>

    ${sections}
  </main>
</body>
</html>`;
}

mocha
  .run((failureCount) => {
    const endedAt = new Date();
    const report = {
      project: {
        name: packageJson.name,
        version: packageJson.version,
        displayName: "Serviço de Pagamento",
      },
      execution: {
        author: getExecutorName(),
        environment: process.env.GITHUB_ACTIONS ? "GitHub Actions" : "Local",
        nodeVersion: process.version,
        workflow: process.env.GITHUB_WORKFLOW || null,
        runId: process.env.GITHUB_RUN_ID || null,
        branch: process.env.GITHUB_REF_NAME || null,
      },
      stats: {
        suites: mocha.suite.suites.length,
        tests: tests.length,
        passes: passes.length,
        pending: pending.length,
        failures: failures.length,
        start: startedAt.toISOString(),
        end: endedAt.toISOString(),
        duration: endedAt.getTime() - startedAt.getTime(),
      },
      tests,
      pending,
      failures,
      passes,
    };

    fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
    fs.writeFileSync(htmlPath, buildHtml(report));

    process.exitCode = failureCount > 0 ? 1 : 0;
  })
  .on("pass", (test) => {
    const item = serializeTest(test);
    tests.push(item);
    passes.push(item);
  })
  .on("fail", (test, err) => {
    const item = serializeTest(test, err);
    tests.push(item);
    failures.push(item);
  })
  .on("pending", (test) => {
    const item = serializeTest(test);
    tests.push(item);
    pending.push(item);
  });
