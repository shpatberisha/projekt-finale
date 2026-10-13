import { evaluate } from 'mathjs';

export const normalizeExpression = (value) => {
  return value
    .replace(/\s+/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
    .replace(/(\d)(sin|cos|tan|sqrt|ln|log|exp|pi|\()/gi, '$1*$2')
    .replace(/(\))(\d)/g, '$1*$2')
    .replace(/(\))(sin|cos|tan|sqrt|ln|log|exp|pi)/gi, '$1*$2');
};

export async function calculateExpression(expression) {
  const raw = expression?.trim();
  if (!raw) return '0';

  try {
    const response = await fetch('http://localhost:3000/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression: raw }),
    });

    if (!response.ok) throw new Error('API error');

    const data = await response.json();
    if (typeof data?.result === 'number') {
      return Number(data.result).toFixed(6).replace(/\.0+$|(?<=\.\d)0+$/g, '');
    }
  } catch {
    const normalized = normalizeExpression(raw);
    const result = evaluate(normalized);

    if (!Number.isFinite(result)) {
      return 'Error';
    }

    return Number(result).toFixed(6).replace(/\.0+$|(?<=\.\d)0+$/g, '');
  }

  return 'Error';
}
