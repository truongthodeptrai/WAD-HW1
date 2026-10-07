import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cartTotal } from '../src/cart.js'

test('the example from the slides', () => {
  const items = [
    { name: 'Áo thun', price: 180000, qty: 2 },
    { name: 'Sổ tay', price: 45000, qty: 1 },
  ]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  const total = cartTotal(items, options)
  // toFixed(0) returns a string, so it must fail these checks.
  assert.equal(typeof total, 'number')
  assert.equal(total, 467400)
})

test('an empty cart returns zero even when shipping is charged', () => {
  assert.equal(cartTotal([], {
    vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000,
  }), 0)
})

test('omitted options return just the subtotal', () => {
  assert.equal(cartTotal([{ price: 100000, qty: 3 }]), 300000)
})

for (const [subtotal, expected] of [
  [499999, 529999],
  [500000, 500000],
  [500001, 500001],
]) {
  test(`shipping at subtotal ${subtotal} gives total ${expected}`, () => {
    assert.equal(cartTotal([{ price: subtotal, qty: 1 }], {
      vatRate: 0, freeShipFrom: 500000, shipFee: 30000,
    }), expected)
  })
}

test('VAT does not count toward the free-shipping threshold', () => {
  assert.equal(cartTotal([{ price: 490000, qty: 1 }], {
    vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000,
  }), 559200)
})

for (const [price, expected] of [[100.4, 100], [100.5, 101], [100.6, 101]]) {
  test(`rounds ${price} to the number ${expected}`, () => {
    const total = cartTotal([{ price, qty: 1 }])
    assert.equal(typeof total, 'number')
    assert.equal(total, expected)
  })
}

test('rounds the final total rather than each item separately', () => {
  assert.equal(cartTotal([
    { price: 10.4, qty: 1 },
    { price: 10.4, qty: 1 },
  ]), 21)
})

test('allows a zero-price item alongside paid items', () => {
  assert.equal(cartTotal([
    { price: 0, qty: 2 },
    { price: 100000, qty: 1 },
  ]), 100000)
})

for (const price of [-1, NaN, Infinity, -Infinity, 'invalid']) {
  test(`rejects invalid price ${String(price)} with RangeError`, () => {
    assert.throws(() => cartTotal([{ price, qty: 1 }]), RangeError)
  })
}

for (const qty of [0, -1, 1.5, NaN, Infinity, 'invalid']) {
  test(`rejects invalid quantity ${String(qty)} with RangeError`, () => {
    assert.throws(() => cartTotal([{ price: 100000, qty }]), RangeError)
  })
}
