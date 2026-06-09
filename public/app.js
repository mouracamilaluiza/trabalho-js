(function initModule(global) {
  function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function parsePaymentForm(values) {
    const codigoBarras = String(values.codigoBarras || '').trim();
    const empresa = String(values.empresa || '').trim();
    const valor = Number(values.valor);

    if (!codigoBarras) {
      throw new Error('Informe o código de barras.');
    }

    if (!empresa) {
      throw new Error('Informe a empresa.');
    }

    if (!Number.isFinite(valor) || valor <= 0) {
      throw new Error('Informe um valor maior que zero.');
    }

    return { codigoBarras, empresa, valor };
  }

  function renderPaymentCard(pagamento) {
    const categoriaClass = pagamento.categoria === 'cara' ? 'cara' : 'padrao';

    return `
      <article class="payment-card">
        <strong>${escapeHtml(pagamento.empresa)}</strong>
        <dl>
          <dt>Código</dt>
          <dd>${escapeHtml(pagamento.codigoBarras)}</dd>
          <dt>Valor</dt>
          <dd>${formatCurrency(pagamento.valor)}</dd>
          <dt>Categoria</dt>
          <dd><span class="tag ${categoriaClass}">${escapeHtml(pagamento.categoria)}</span></dd>
        </dl>
      </article>
    `;
  }

  function initPaymentApp(documentRef, ServiceClass) {
    const servico = new ServiceClass();
    const form = documentRef.querySelector('#payment-form');
    const feedback = documentRef.querySelector('#feedback');
    const ultimoPagamento = documentRef.querySelector('#ultimo-pagamento');
    const listaPagamentos = documentRef.querySelector('#lista-pagamentos');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      try {
        const dados = parsePaymentForm({
          codigoBarras: form.codigoBarras.value,
          empresa: form.empresa.value,
          valor: form.valor.value,
        });

        const pagamento = servico.pagar(dados.codigoBarras, dados.empresa, dados.valor);
        const item = documentRef.createElement('li');

        item.innerHTML = renderPaymentCard(pagamento);
        listaPagamentos.prepend(item);
        ultimoPagamento.innerHTML = renderPaymentCard(servico.consultarUltimoPagamento());
        feedback.textContent = 'Pagamento registrado com sucesso.';
        form.reset();
      } catch (error) {
        feedback.textContent = error.message;
      }
    });

    return servico;
  }

  const api = {
    escapeHtml,
    formatCurrency,
    initPaymentApp,
    parsePaymentForm,
    renderPaymentCard,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  global.ServicoDePagamentoFront = api;

  if (global.document && global.ServicoDePagamento) {
    global.document.addEventListener('DOMContentLoaded', () => {
      initPaymentApp(global.document, global.ServicoDePagamento);
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
