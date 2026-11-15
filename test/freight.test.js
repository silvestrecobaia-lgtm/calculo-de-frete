const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateFreight } = require('../public/freight.js');

const decisionCases = [
  { region: 'sudeste', regionCost: 10 },
  { region: 'centro-oeste', regionCost: 15 },
  { region: 'norte', regionCost: 20 },
].flatMap(({ region, regionCost }) => [
  { region, regionCost, weight: 5, weightCost: 0 },
  { region, regionCost, weight: 6, weightCost: 2 },
].flatMap(({ region, regionCost, weight, weightCost }) => ['normal', 'express'].map((delivery) => {
  const subtotal = regionCost + weightCost;
  const expressCost = delivery === 'express' ? subtotal * 0.5 : 0;
  return {
    region,
    weight,
    delivery,
    expected: { regionCost, weightCost, subtotal, expressCost, total: subtotal + expressCost },
  };
})));

for (const { region, weight, delivery, expected } of decisionCases) {
  test(`decision table: ${region}, ${weight} kg, ${delivery}`, () => {
    assert.deepEqual(calculateFreight({ region, weight, delivery }), expected);
  });
}

test('applies the regional base fare', () => {
  assert.equal(calculateFreight({ region: 'sul', weight: 1 }).total, 10);
  assert.equal(calculateFreight({ region: 'sudeste', weight: 1 }).regionCost, 10);
  assert.equal(calculateFreight({ region: 'centro-oeste', weight: 1 }).regionCost, 15);
  assert.equal(calculateFreight({ region: 'norte', weight: 1 }).regionCost, 20);
  assert.equal(calculateFreight({ region: 'nordeste', weight: 1 }).regionCost, 20);
});

test('does not add a weight charge at or below five kilograms', () => {
  assert.equal(calculateFreight({ region: 'sul', weight: 5 }).weightCost, 0);
  assert.equal(calculateFreight({ region: 'sul', weight: 2.5 }).weightCost, 0);
});

test('charges two reais for each kilogram above five', () => {
  assert.equal(calculateFreight({ region: 'sul', weight: 6 }).weightCost, 2);
  assert.equal(calculateFreight({ region: 'sul', weight: 7.5 }).weightCost, 5);
});

test('adds the express surcharge to the regional and weight subtotal', () => {
  assert.deepEqual(
    calculateFreight({ region: 'norte', weight: 7, delivery: 'express' }),
    { regionCost: 20, weightCost: 4, subtotal: 24, expressCost: 12, total: 36 },
  );
});

test('rejects unsupported regions, delivery types, and invalid weights', () => {
  assert.throws(() => calculateFreight({ region: 'leste', weight: 1 }), RangeError);
  assert.throws(() => calculateFreight({ region: 'sul', weight: 0 }), RangeError);
  assert.throws(() => calculateFreight({ region: 'sul', weight: Infinity }), RangeError);
  assert.throws(() => calculateFreight({ region: 'sul', weight: 1, delivery: 'overnight' }), RangeError);
});
