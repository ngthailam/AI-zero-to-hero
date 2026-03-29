import { reverseString } from '../generated.js';

describe('reverseString', () => {
  test('reverses a regular string', () => {
    expect(reverseString('hello')).toBe('olleh');
  });

  test('reverses a string with spaces', () => {
    expect(reverseString('hello world')).toBe('dlrow olleh');
  });

  test('reverses a string with special characters', () => {
    expect(reverseString('!@#abc')).toBe('cba#@!');
  });

  test('returns empty string when input is empty', () => {
    expect(reverseString('')).toBe('');
  });

  test('reverses a single character string', () => {
    expect(reverseString('a')).toBe('a');
  });
});