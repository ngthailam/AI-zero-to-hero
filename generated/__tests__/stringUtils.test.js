import { reverse } from '../src/stringUtils.js';

describe('reverse', () => {
  test('reverses a regular string', () => {
    expect(reverse('hello')).toBe('olleh');
  });

  test('reverses an empty string', () => {
    expect(reverse('')).toBe('');
  });

  test('reverses a string with spaces', () => {
    expect(reverse('hello world')).toBe('dlrow olleh');
  });

  test('reverses a string with special characters', () => {
    expect(reverse('!@# $%^')).toBe('^%$ #@!');
  });

  test('reverses a palindrome string', () => {
    expect(reverse('madam')).toBe('madam');
  });

  test('reverses a string with unicode characters', () => {
    expect(reverse('😊👍')).toBe('👍😊');
  });

  test('reverses a string with mixed case', () => {
    expect(reverse('AbC123')).toBe('321CbA');
  });
});