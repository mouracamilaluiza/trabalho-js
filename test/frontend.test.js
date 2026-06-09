const assert = require('node:assert/strict');
const {
  escapeHtml,
  formatCurrency,
  parsePaymentForm,
  renderPaymentCard,
} = require('../public/app');

describe('Front do ServicoDePagamento', () => {
  it('deve validar e normalizar os dados do formulário', () => {
    const dados = parsePaymentForm({
      codigoBarras: ' 1234-5678 ',
      empresa: ' Empresa Teste ',
      valor: '99.99',
    });

    assert.deepEqual(dados, {
      codigoBarras: '1234-5678',
      empresa: 'Empresa Teste',
      valor: 99.99,
    });
  });

  it('deve rejeitar valor menor ou igual a zero', () => {
    assert.throws(
      () => parsePaymentForm({ codigoBarras: '123', empresa: 'Empresa', valor: '0' }),
      /valor maior que zero/
    );
  });

  it('deve formatar valores em reais', () => {
    assert.match(formatCurrency(156.87), /156,87/);
  });

  it('deve escapar textos antes de renderizar HTML', () => {
    assert.equal(escapeHtml('<script>alert("x")</script>'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  });

  it('deve renderizar um card de pagamento com categoria', () => {
    const html = renderPaymentCard({
      codigoBarras: '0987-7656-3475',
      empresa: 'Samar',
      valor: 156.87,
      categoria: 'cara',
    });

    assert.match(html, /Samar/);
    assert.match(html, /0987-7656-3475/);
    assert.match(html, /R\$/);
    assert.match(html, /tag cara/);
  });
});
