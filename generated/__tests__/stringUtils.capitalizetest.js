import { capitalize } from '../src/stringUtils.js';

describe('capitalize', () => {
  test('capitalizes the first letter of a lowercase word', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  test('returns empty string when input is empty', () => {
    expect(capitalize('')).toBe('');
  });

  test('returns empty string when input is not a string', () => {
    expect(capitalize(null)).toBe('');
    expect(capitalize(undefined)).toBe('');
    expect(capitalize(123)).toBe('');
    expect(capitalize({})).toBe('');
  });

  test('does not change the rest of the string', () => {
    expect(capitalize('hELLO')).toBe('HELLO');
  });

  test('capitalizes a single character string', () => {
    expect(capitalize('a')).toBe('A');
  });

  test('capitalizes a string starting with a non-letter character', () => {
    expect(capitalize('1abc')).toBe('1abc');
    expect(capitalize('!abc')).toBe('!abc');
  });

  test('capitalizes a string with leading whitespace', () => {
    expect(capitalize(' hello')).toBe(' hello');
  });

  test('capitalizes a string with unicode characters', () => {
    expect(capitalize('😊smile')).toBe('😊smile');
  });
});