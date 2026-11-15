(function exposeFreightCalculator(root, factory) {
  const calculator = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = calculator;
  }

  if (root) {
    root.FreightCalculator = calculator;
  }
})(typeof globalThis === 'object' ? globalThis : this, function createFreightCalculator() {
  const pricesByRegion = Object.freeze({
    sul: 10,
    sudeste: 10,
    'centro-oeste': 15,
    norte: 20,
    nordeste: 20,
  });

  function calculateFreight({ region, weight, delivery = 'normal' } = {}) {
    if (!Object.hasOwn(pricesByRegion, region)) {
      throw new RangeError('Região inválida.');
    }

    if (typeof weight !== 'number' || !Number.isFinite(weight) || weight <= 0) {
      throw new RangeError('O peso deve ser um número maior que zero.');
    }

    if (delivery !== 'normal' && delivery !== 'express') {
      throw new RangeError('Tipo de entrega inválido.');
    }

    const regionCost = pricesByRegion[region];
    const weightCost = Math.max(0, weight - 5) * 2;
    const subtotal = regionCost + weightCost;
    const expressCost = delivery === 'express' ? subtotal * 0.5 : 0;

    return {
      regionCost,
      weightCost,
      subtotal,
      expressCost,
      total: subtotal + expressCost,
    };
  }

  return Object.freeze({ calculateFreight, pricesByRegion });
});
