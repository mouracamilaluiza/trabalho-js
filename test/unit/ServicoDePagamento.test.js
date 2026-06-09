const { test, expect } = require("@playwright/test");
const ServicoDePagamento = require("../../shared/services/ServicoDePagamento");

test.describe("ServicoDePagamento", () => {
  const cenariosDeCategoria = [
    {
      titulo:
        "deve realizar pagamento com categoria cara quando o valor for maior que 100.00",
      codigoBarras: "0987-7656-3475",
      empresa: "Samar",
      valor: 156.87,
      categoria: "cara",
    },
    {
      titulo:
        "deve realizar pagamento com categoria padrão quando o valor for menor ou igual a 100.00",
      codigoBarras: "1234-5678-9012",
      empresa: "Empresa Teste",
      valor: 100.0,
      categoria: "padrão",
    },
    {
      titulo:
        "deve realizar pagamento com categoria cara quando o valor for 100.01",
      codigoBarras: "7777-8888-9999",
      empresa: "Empresa Cara",
      valor: 100.01,
      categoria: "cara",
    },
    {
      titulo:
        "deve realizar pagamento com categoria padrão quando o valor for menor que 100.00",
      codigoBarras: "2222-3333-4444",
      empresa: "Empresa Barata",
      valor: 99.99,
      categoria: "padrão",
    },
  ];

  for (const cenario of cenariosDeCategoria) {
    test(cenario.titulo, () => {
      const servicoDePagamento = new ServicoDePagamento();

      const pagamento = servicoDePagamento.pagar(
        cenario.codigoBarras,
        cenario.empresa,
        cenario.valor,
      );

      expect(pagamento).toEqual({
        codigoBarras: cenario.codigoBarras,
        empresa: cenario.empresa,
        valor: cenario.valor,
        categoria: cenario.categoria,
      });
    });
  }

  test("deve armazenar os pagamentos realizados na lista de pagamentos", () => {
    const servicoDePagamento = new ServicoDePagamento();

    const primeiroPagamento = servicoDePagamento.pagar(
      "1111-1111-1111",
      "Empresa A",
      10.0,
    );
    const segundoPagamento = servicoDePagamento.pagar(
      "2222-2222-2222",
      "Empresa B",
      200.0,
    );

    expect(servicoDePagamento.pagamentos).toEqual([
      primeiroPagamento,
      segundoPagamento,
    ]);
  });

  test("deve consultar apenas o último pagamento realizado", () => {
    const servicoDePagamento = new ServicoDePagamento();

    servicoDePagamento.pagar("1111-2222-3333", "Primeira Empresa", 50.0);
    servicoDePagamento.pagar("4444-5555-6666", "Ultima Empresa", 250.0);

    expect(servicoDePagamento.consultarUltimoPagamento()).toEqual({
      codigoBarras: "4444-5555-6666",
      empresa: "Ultima Empresa",
      valor: 250.0,
      categoria: "cara",
    });
  });

  test("deve retornar null quando nenhum pagamento tiver sido realizado", () => {
    const servicoDePagamento = new ServicoDePagamento();

    expect(servicoDePagamento.consultarUltimoPagamento()).toBeNull();
  });
});
