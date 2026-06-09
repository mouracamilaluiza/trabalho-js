(function initPagamentoDomain(global) {
  const LIMITE_CATEGORIA_CARA = 100.0;

  function classificarCategoria(valor) {
    return valor > LIMITE_CATEGORIA_CARA ? "cara" : "padrão";
  }

  function criarPagamento({ codigoBarras, empresa, valor }) {
    return {
      codigoBarras,
      empresa,
      valor,
      categoria: classificarCategoria(valor),
    };
  }

  const PagamentoDomain = {
    LIMITE_CATEGORIA_CARA,
    classificarCategoria,
    criarPagamento,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = PagamentoDomain;
  }

  global.PagamentoDomain = PagamentoDomain;
})(typeof window !== "undefined" ? window : globalThis);
