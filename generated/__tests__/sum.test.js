import { sum } from '../src/sum.js';

describe('sum function', () => {
  test('adds two positive integers', () => {
    expect(sum(3, 5)).toBe(8);
  });

  test('adds two negative integers', () => {
    expect(sum(-4, -6)).toBe(-10);
  });

  test('adds a positive and a negative integer', () => {
    expect(sum(7, -2)).toBe(5);
  });

  test('adds zero and a positive integer', () => {
    expect(sum(0, 9)).toBe(9);
  });

  test('adds zero and a negative integer', () => {
    expect(sum(0, -3)).toBe(-3);
  });

  test('adds zero and zero', () => {
    expect(sum(0, 0)).toBe(0);
  });
});