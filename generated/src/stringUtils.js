export function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function reverse(str) {
  if (typeof str !== 'string') {
    return '';
  }
  return Array.from(str).reverse().join('');
}
