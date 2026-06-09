const path = require("path");
const { expect } = require("@playwright/test");

class PagamentoPage {
  constructor(page) {
    this.page = page;
    this.url = `file://${path.resolve(__dirname, "../../../public/index.html")}`;
    this.codigoBarrasInput = page.getByLabel("Código de barras");
    this.empresaInput = page.getByLabel("Empresa");
    this.valorInput = page.getByLabel("Valor");
    this.registrarButton = page.getByRole("button", {
      name: "Registrar pagamento",
    });
    this.feedback = page.getByRole("status");
    this.ultimoPagamento = page.locator("#ultimo-pagamento");
    this.itensHistorico = page.locator("#lista-pagamentos li");
  }

  async abrir() {
    await this.page.goto(this.url);
  }

  async registrarPagamento({ codigoBarras, empresa, valor }) {
    await this.codigoBarrasInput.fill(codigoBarras);
    await this.empresaInput.fill(empresa);
    await this.valorInput.fill(valor);
    await this.registrarButton.click();
  }

  async preencherFormulario({ codigoBarras = "", empresa = "", valor = "" }) {
    await this.codigoBarrasInput.fill(codigoBarras);
    await this.empresaInput.fill(empresa);
    await this.valorInput.fill(valor);
  }

  async enviarFormulario() {
    await this.registrarButton.click();
  }

  async deveExibirMensagem(mensagem) {
    await expect(this.feedback).toHaveText(mensagem);
  }

  async deveExibirEstadoInicial() {
    await expect(this.ultimoPagamento).toHaveText(
      "Nenhum pagamento realizado.",
    );
    await this.deveTerQuantidadeNoHistorico(0);
  }

  async deveExibirUltimoPagamentoComTextos(textos) {
    for (const texto of textos) {
      await expect(this.ultimoPagamento).toContainText(texto);
    }
  }

  async deveTerQuantidadeNoHistorico(quantidade) {
    await expect(this.itensHistorico).toHaveCount(quantidade);
  }

  async deveExibirItemDoHistoricoComTextos(posicao, textos) {
    const item = this.itensHistorico.nth(posicao);

    for (const texto of textos) {
      await expect(item).toContainText(texto);
    }
  }

  async deveLimparFormulario() {
    await expect(this.codigoBarrasInput).toHaveValue("");
    await expect(this.empresaInput).toHaveValue("");
    await expect(this.valorInput).toHaveValue("");
  }

  async deveMarcarValorComoInvalido() {
    await expect
      .poll(async () =>
        this.valorInput.evaluate((input) => input.validity.valid),
      )
      .toBe(false);
  }
}

module.exports = {
  PagamentoPage,
};
