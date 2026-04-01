import { sum } from '../src/sum.js';

describe('sum', () => {
  test('adds two positive numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('adds positive and negative number', () => {
    expect(sum(5, -3)).toBe(2);
  });

  test('adds two negative numbers', () => {
    expect(sum(-4, -6)).toBe(-10);
  });

  test('adds zero', () => {
    expect(sum(0, 5)).toBe(5);
    expect(sum(5, 0)).toBe(5);
  });

  test('adds decimals', () => {
    expect(sum(1.5, 2.3)).toBeCloseTo(3.8);
  });
});