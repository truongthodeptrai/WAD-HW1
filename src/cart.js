export function cartTotal(items, options = {}) {
  // Check if item(s) 
  if (!Array.isArray(items) || items.length === 0) {
    return 0
  }

  const vatRate = Number.isFinite(Number(options.vatRate)) ? Number(options.vatRate) : 0
  const freeShipFrom = Number.isFinite(Number(options.freeShipFrom)) ? Number(options.freeShipFrom) : 0
  const shipFee = Number.isFinite(Number(options.shipFee)) ? Number(options.shipFee) : 0

  let subtotal = 0

  for (const item of items) {
    const price = Number(item.price)
    const qty = Number(item.qty)

    if (!Number.isFinite(price) || price < 0) {
      throw new RangeError('Item price must be a non-negative number')
    }

    if (!Number.isInteger(qty) || qty <= 0) {
      throw new RangeError('Item quantity must be a positive integer')
    }

    subtotal += price * qty
  }

  if (subtotal === 0) {
    return 0
  }

  let shipping
  if (subtotal < freeShipFrom) {
    shipping = shipFee
  } else {
    shipping = 0
  }
  const total = subtotal + subtotal * vatRate + shipping

  return Math.round(total)
}
