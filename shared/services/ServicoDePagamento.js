(function initServicoDePagamento(global) {
  const PagamentoDomain =
    typeof module !== "undefined" && module.exports
      ? require("../domain/Pagamento")
      : global.PagamentoDomain;

  class ServicoDePagamento {
    constructor() {
      this.pagamentos = [];
    }

    pagar(codigoBarras, empresa, valor) {
      const pagamento = PagamentoDomain.criarPagamento({
        codigoBarras,
        empresa,
        valor,
      });

      this.pagamentos.push(pagamento);

      return pagamento;
    }

    consultarUltimoPagamento() {
      if (this.pagamentos.length === 0) {
        return null;
      }

      return this.pagamentos[this.pagamentos.length - 1];
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = ServicoDePagamento;
  }

  global.ServicoDePagamento = ServicoDePagamento;
})(typeof window !== "undefined" ? window : globalThis);
