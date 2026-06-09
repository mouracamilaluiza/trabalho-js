const fs = require("fs");
const path = require("path");
const Mocha = require("mocha");

const rootDir = path.resolve(__dirname, "..");
const testDir = path.join(rootDir, "test");
const jsonPath = path.join(rootDir, "relatorio-testes.json");
const htmlPath = path.join(rootDir, "relatorio-testes.html");

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

  return {
    title: test.title,
    fullTitle,
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

function buildHtml(report) {
  const statusClass = report.stats.failures > 0 ? "failed" : "passed";
  const statusText = report.stats.failures > 0 ? "Falhou" : "Passou";
  const generatedAt = new Date(report.stats.end).toLocaleString("pt-BR");

  const rows = report.tests
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

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Relatório de Testes</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f8fb;
      --panel: #ffffff;
      --text: #172033;
      --muted: #5d677a;
      --border: #d9deea;
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
      width: min(1040px, calc(100% - 32px));
      margin: 32px auto;
    }

    header {
      margin-bottom: 24px;
    }

    h1 {
      margin: 0 0 8px;
      font-size: 32px;
      letter-spacing: 0;
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

    section {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
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
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Relatório de Testes</h1>
      <p class="meta">Gerado em ${escapeHtml(generatedAt)}</p>
    </header>

    <div class="summary">
      <div class="metric"><strong class="result">${statusText}</strong><span>Resultado</span></div>
      <div class="metric"><strong>${report.stats.tests}</strong><span>Total de testes</span></div>
      <div class="metric"><strong>${report.stats.passes}</strong><span>Passaram</span></div>
      <div class="metric"><strong>${report.stats.failures}</strong><span>Falharam</span></div>
      <div class="metric"><strong>${report.stats.duration} ms</strong><span>Duração</span></div>
    </div>

    <section>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Teste</th>
            <th>Duração</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>`;
}

mocha
  .run((failureCount) => {
    const endedAt = new Date();
    const report = {
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
