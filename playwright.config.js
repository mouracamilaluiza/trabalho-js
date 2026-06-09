const { defineConfig } = require("@playwright/test");

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
  // Mantém a CI mais previsível; localmente o Playwright decide a quantidade.
  workers: process.env.CI ? 1 : undefined,
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
      // Projeto principal usado nos testes de front.
      name: "chromium",
      use: {
        browserName: "chromium",
      },
    },
  ],
});
