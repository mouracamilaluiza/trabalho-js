const { test, expect } = require("@playwright/test");
const PagamentoDomain = require("../../shared/domain/Pagamento");

test.describe("Dominio de Pagamento", () => {
  const cenariosDeCategoria = [
    { valor: 100.01, categoria: "cara" },
    { valor: 100.0, categoria: "padrão" },
    { valor: 99.99, categoria: "padrão" },
  ];

  for (const cenario of cenariosDeCategoria) {
    test(`deve classificar valor ${cenario.valor} como categoria ${cenario.categoria}`, () => {
      expect(PagamentoDomain.classificarCategoria(cenario.valor)).toBe(
        cenario.categoria,
      );
    });
  }

  test("deve criar pagamento com categoria calculada pelo domínio", () => {
    const pagamento = PagamentoDomain.criarPagamento({
      codigoBarras: "0987-7656-3475",
      empresa: "Samar",
      valor: 156.87,
    });

    expect(pagamento).toEqual({
      codigoBarras: "0987-7656-3475",
      empresa: "Samar",
      valor: 156.87,
      categoria: "cara",
    });
  });
});
