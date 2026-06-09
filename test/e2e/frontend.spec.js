const { test } = require("@playwright/test");
const { PagamentoPage } = require("./pages/PagamentoPage");

test.describe("Front do ServicoDePagamento", () => {
  let pagamentoPage;

  test.beforeEach(async ({ page }) => {
    pagamentoPage = new PagamentoPage(page);
    await pagamentoPage.abrir();
  });

  test("deve iniciar sem pagamento registrado", async () => {
    await pagamentoPage.deveExibirEstadoInicial();
  });

  test("deve registrar pagamento caro e atualizar último pagamento e histórico", async () => {
    await pagamentoPage.registrarPagamento({
      codigoBarras: "0987-7656-3475",
      empresa: "Samar",
      valor: "156.87",
    });

    await pagamentoPage.deveExibirMensagem("Pagamento registrado com sucesso.");
    await pagamentoPage.deveExibirUltimoPagamentoComTextos([
      "Samar",
      "0987-7656-3475",
      "R$",
      "cara",
    ]);
    await pagamentoPage.deveTerQuantidadeNoHistorico(1);
    await pagamentoPage.deveLimparFormulario();
  });

  test("deve classificar pagamento de valor menor ou igual a 100 como padrão", async () => {
    await pagamentoPage.registrarPagamento({
      codigoBarras: "1234-5678-9012",
      empresa: "Empresa Teste",
      valor: "100.00",
    });

    await pagamentoPage.deveExibirUltimoPagamentoComTextos(["padrão"]);
  });

  test("deve impedir envio quando o valor for inválido", async () => {
    await pagamentoPage.preencherFormulario({
      codigoBarras: "9999-8888-7777",
      empresa: "Empresa Inválida",
      valor: "-10.00",
    });
    await pagamentoPage.enviarFormulario();

    await pagamentoPage.deveMarcarValorComoInvalido();
    await pagamentoPage.deveExibirEstadoInicial();
  });

  test("deve manter o pagamento mais recente como último pagamento", async () => {
    await pagamentoPage.registrarPagamento({
      codigoBarras: "1111-2222-3333",
      empresa: "Primeira Empresa",
      valor: "50.00",
    });

    await pagamentoPage.registrarPagamento({
      codigoBarras: "4444-5555-6666",
      empresa: "Ultima Empresa",
      valor: "250.00",
    });

    await pagamentoPage.deveExibirUltimoPagamentoComTextos([
      "Ultima Empresa",
      "4444-5555-6666",
    ]);
    await pagamentoPage.deveTerQuantidadeNoHistorico(2);
  });

  test("deve listar o pagamento mais recente no topo do histórico", async () => {
    await pagamentoPage.registrarPagamento({
      codigoBarras: "1111-2222-3333",
      empresa: "Primeira Empresa",
      valor: "50.00",
    });

    await pagamentoPage.registrarPagamento({
      codigoBarras: "4444-5555-6666",
      empresa: "Ultima Empresa",
      valor: "250.00",
    });

    await pagamentoPage.deveExibirItemDoHistoricoComTextos(0, [
      "Ultima Empresa",
      "4444-5555-6666",
      "cara",
    ]);
    await pagamentoPage.deveExibirItemDoHistoricoComTextos(1, [
      "Primeira Empresa",
      "1111-2222-3333",
      "padrão",
    ]);
  });
});
