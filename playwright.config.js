const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./test",
  timeout: 30000,
  expect: {
    // Tempo máximo para asserções que aguardam mudanças na UI.
    timeout: 5000,
  },
  // Permite executar arquivos de teste em paralelo
  fullyParallel: true,
  // Evita que um test.only esquecido seja enviado para a pipeline.
  forbidOnly: !!process.env.CI,
  // Reexecuta testes instáveis apenas no ambiente de CI.
  retries: process.env.CI ? 2 : 0,
  // Usa paralelismo controlado na CI; localmente o Playwright decide a quantidade.
  workers: process.env.CI ? 2 : undefined,
  use: {
    // Evidências geradas apenas quando ajudam a investigar falhas.
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  reporter: [
    // Saída legível no terminal.
    ["list"],
    // Relatório nativo do Playwright para análise local.
    ["html", { outputFolder: "playwright-report", open: "never" }],
    // Resultados consumidos pelo Allure para gerar o relatório publicado.
    ["allure-playwright", { outputFolder: "allure-results" }],
  ],
  projects: [
    {
      // Testes unitários rodam uma única vez, sem multiplicar por navegador.
      name: "unit",
      testMatch: /.*\/unit\/.*\.test\.js/,
    },
    {
      // Testes E2E rodam no Chromium.
      name: "chromium",
      testMatch: /.*\/e2e\/.*\.spec\.js/,
      use: {
        browserName: "chromium",
      },
    },
    {
      // Testes E2E também rodam no Firefox para validar compatibilidade.
      name: "firefox",
      testMatch: /.*\/e2e\/.*\.spec\.js/,
      use: {
        browserName: "firefox",
      },
    },
    {
      // Testes E2E em viewport mobile para validar responsividade.
      name: "mobile-chromium",
      testMatch: /.*\/e2e\/.*\.spec\.js/,
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],
});
