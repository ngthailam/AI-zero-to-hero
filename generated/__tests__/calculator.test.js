import Calculator from '../src/calculator.js';

describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    test('adds two positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    test('adds positive and negative number', () => {
      expect(calculator.add(5, -2)).toBe(3);
    });

    test('adds two negative numbers', () => {
      expect(calculator.add(-4, -6)).toBe(-10);
    });

    test('adds zero', () => {
      expect(calculator.add(0, 5)).toBe(5);
      expect(calculator.add(5, 0)).toBe(5);
    });

    test('adds floating point numbers', () => {
      expect(calculator.add(1.5, 2.3)).toBeCloseTo(3.8);
    });
  });

  describe('subtract', () => {
    test('subtracts two positive numbers', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
    });

    test('subtracts positive and negative number', () => {
      expect(calculator.subtract(5, -2)).toBe(7);
    });

    test('subtracts two negative numbers', () => {
      expect(calculator.subtract(-4, -6)).toBe(2);
    });

    test('subtracts zero', () => {
      expect(calculator.subtract(0, 5)).toBe(-5);
      expect(calculator.subtract(5, 0)).toBe(5);
    });

    test('subtracts floating point numbers', () => {
      expect(calculator.subtract(5.5, 2.2)).toBeCloseTo(3.3);
    });
  });
});