class ServicoDePagamento {
  constructor() {
    this.pagamentos = [];
  }

  pagar(codigoBarras, empresa, valor) {
    const pagamento = {
      codigoBarras,
      empresa,
      valor,
      categoria: valor > 100.0 ? 'cara' : 'padrão',
    };

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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ServicoDePagamento;
}

if (typeof window !== 'undefined') {
  window.ServicoDePagamento = ServicoDePagamento;
}
