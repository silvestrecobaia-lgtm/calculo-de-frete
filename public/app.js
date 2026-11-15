const regionNames = {
  sul: 'Sul',
  sudeste: 'Sudeste',
  'centro-oeste': 'Centro-Oeste',
  norte: 'Norte',
  nordeste: 'Nordeste',
};

const form = document.querySelector('#freight-form');
const regionInput = document.querySelector('#region');
const weightInput = document.querySelector('#weight');
const totalOutput = document.querySelector('#total');
const captionOutput = document.querySelector('#result-caption');
const regionCostOutput = document.querySelector('#region-cost');
const weightCostOutput = document.querySelector('#weight-cost');
const expressRow = document.querySelector('#express-row');
const expressCostOutput = document.querySelector('#express-cost');
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function updateEstimate() {
  const region = regionInput.value;
  const weight = Number(weightInput.value);
  const express = form.elements.delivery.value === 'express';
  const validWeight = Number.isFinite(weight) && weight > 0;

  if (!region || !validWeight) {
    totalOutput.textContent = '—';
    captionOutput.textContent = 'Informe o destino e o peso para ver sua estimativa.';
    regionCostOutput.textContent = '—';
    weightCostOutput.textContent = '—';
    expressRow.hidden = true;
    return;
  }

  const estimate = FreightCalculator.calculateFreight({
    region,
    weight,
    delivery: express ? 'express' : 'normal',
  });

  totalOutput.textContent = currency.format(estimate.total).replace(/^R\$\s?/, '');
  captionOutput.textContent = `${regionNames[region]} · ${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(weight)} kg · entrega ${express ? 'expressa' : 'normal'}`;
  regionCostOutput.textContent = currency.format(estimate.regionCost);
  weightCostOutput.textContent = currency.format(estimate.weightCost);
  expressCostOutput.textContent = currency.format(estimate.expressCost);
  expressRow.hidden = !express;
}

form.addEventListener('input', updateEstimate);
form.addEventListener('change', updateEstimate);
