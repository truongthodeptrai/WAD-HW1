# AGENTS.md

## Task Rules

Implement the cart total calculation according to the following requirements.

### Shipping

- Calculate the cart subtotal before VAT and shipping.
- If `subtotal >= freeShipFrom`, shipping must be `0`.
- Otherwise, apply the configured shipping cost.

### Empty Cart

- An empty cart must return exactly `0`.
- Do not apply VAT.
- Do not apply shipping.

### Input Validation

Each cart item must satisfy:

- `price` must not be negative.
- `qty` must be a positive integer (`1`, `2`, `3`, ...).

If either condition is violated, throw a `RangeError`.

### Result

- The returned value must be a JavaScript `number`.
- Round the final result to the nearest whole đồng.
- Do not return a formatted string.

### Dependencies

- Do not install or use external testing dependencies.
- Tests must use the built-in `node:test` module only.

## Testing

Use:

```bash
npm test