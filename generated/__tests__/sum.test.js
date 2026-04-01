import { sum } from '../src/sum.js';

describe('sum function', () => {
  test('adds two positive numbers', () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(10, 20)).toBe(30);
  });

  test('adds two negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
    expect(sum(-10, -20)).toBe(-30);
  });

  test('adds positive and negative numbers', () => {
    expect(sum(5, -3)).toBe(2);
    expect(sum(-5, 3)).toBe(-2);
  });

  test('adds zero values', () => {
    expect(sum(0, 0)).toBe(0);
    expect(sum(0, 5)).toBe(5);
    expect(sum(5, 0)).toBe(5);
  });

  test('adds large numbers', () => {
    expect(sum(1000000, 2000000)).toBe(3000000);
  });
});