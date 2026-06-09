const escapeHtml = window.escapeHtml;
const ServiceClass = window.ServicoDePagamento;

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function parsePaymentForm(values) {
  const codigoBarras = String(values.codigoBarras || "").trim();
  const empresa = String(values.empresa || "").trim();
  const valor = Number(values.valor);

  if (!codigoBarras) {
    throw new Error("Informe o código de barras.");
  }

  if (!empresa) {
    throw new Error("Informe a empresa.");
  }

  if (!Number.isFinite(valor) || valor <= 0) {
    throw new Error("Informe um valor maior que zero.");
  }

  return { codigoBarras, empresa, valor };
}

function renderPaymentCard(pagamento) {
  const categoriaClass = pagamento.categoria === "cara" ? "cara" : "padrao";

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

function initPaymentApp(documentRef, PaymentService) {
  const servico = new PaymentService();
  const form = documentRef.querySelector("#payment-form");
  const feedback = documentRef.querySelector("#feedback");
  const ultimoPagamento = documentRef.querySelector("#ultimo-pagamento");
  const listaPagamentos = documentRef.querySelector("#lista-pagamentos");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    try {
      const dados = parsePaymentForm({
        codigoBarras: form.codigoBarras.value,
        empresa: form.empresa.value,
        valor: form.valor.value,
      });

      const pagamento = servico.pagar(
        dados.codigoBarras,
        dados.empresa,
        dados.valor,
      );
      const item = documentRef.createElement("li");

      item.innerHTML = renderPaymentCard(pagamento);
      listaPagamentos.prepend(item);
      ultimoPagamento.innerHTML = renderPaymentCard(
        servico.consultarUltimoPagamento(),
      );
      feedback.textContent = "Pagamento registrado com sucesso.";
      form.reset();
    } catch (error) {
      feedback.textContent = error.message;
    }
  });

  return servico;
}

document.addEventListener("DOMContentLoaded", () => {
  initPaymentApp(document, ServiceClass);
});
