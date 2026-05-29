const assert = require('node:assert/strict');
const ServicoDePagamento = require('../src/ServicoDePagamento');

describe('ServicoDePagamento', () => {
  it('deve realizar pagamento com categoria cara quando o valor for maior que 100.00', () => {
    const servicoDePagamento = new ServicoDePagamento();

    const pagamento = servicoDePagamento.pagar('0987-7656-3475', 'Samar', 156.87);

    assert.deepEqual(pagamento, {
      codigoBarras: '0987-7656-3475',
      empresa: 'Samar',
      valor: 156.87,
      categoria: 'cara',
    });
  });

  it('deve realizar pagamento com categoria padrão quando o valor for menor ou igual a 100.00', () => {
    const servicoDePagamento = new ServicoDePagamento();

    const pagamento = servicoDePagamento.pagar('1234-5678-9012', 'Empresa Teste', 100.0);

    assert.deepEqual(pagamento, {
      codigoBarras: '1234-5678-9012',
      empresa: 'Empresa Teste',
      valor: 100.0,
      categoria: 'padrão',
    });
  });

  it('deve realizar pagamento com categoria cara quando o valor for 100.01', () => {
    const servicoDePagamento = new ServicoDePagamento();

    const pagamento = servicoDePagamento.pagar('7777-8888-9999', 'Empresa Cara', 100.01);

    assert.deepEqual(pagamento, {
      codigoBarras: '7777-8888-9999',
      empresa: 'Empresa Cara',
      valor: 100.01,
      categoria: 'cara',
    });
  });

  it('deve realizar pagamento com categoria padrão quando o valor for menor que 100.00', () => {
    const servicoDePagamento = new ServicoDePagamento();

    const pagamento = servicoDePagamento.pagar('2222-3333-4444', 'Empresa Barata', 99.99);

    assert.deepEqual(pagamento, {
      codigoBarras: '2222-3333-4444',
      empresa: 'Empresa Barata',
      valor: 99.99,
      categoria: 'padrão',
    });
  });

  it('deve armazenar os pagamentos realizados na lista de pagamentos', () => {
    const servicoDePagamento = new ServicoDePagamento();

    const primeiroPagamento = servicoDePagamento.pagar('1111-1111-1111', 'Empresa A', 10.0);
    const segundoPagamento = servicoDePagamento.pagar('2222-2222-2222', 'Empresa B', 200.0);

    assert.deepEqual(servicoDePagamento.pagamentos, [
      primeiroPagamento,
      segundoPagamento,
    ]);
  });

  it('deve consultar apenas o ultimo pagamento realizado', () => {
    const servicoDePagamento = new ServicoDePagamento();

    servicoDePagamento.pagar('1111-2222-3333', 'Primeira Empresa', 50.0);
    servicoDePagamento.pagar('4444-5555-6666', 'Ultima Empresa', 250.0);

    assert.deepEqual(servicoDePagamento.consultarUltimoPagamento(), {
      codigoBarras: '4444-5555-6666',
      empresa: 'Ultima Empresa',
      valor: 250.0,
      categoria: 'cara',
    });
  });

  it('deve retornar null quando nenhum pagamento tiver sido realizado', () => {
    const servicoDePagamento = new ServicoDePagamento();

    assert.equal(servicoDePagamento.consultarUltimoPagamento(), null);
  });
});
