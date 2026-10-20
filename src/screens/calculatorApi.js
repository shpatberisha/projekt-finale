import { evaluate } from 'mathjs';

const normalizeTrigDegrees = (value = '') => {
  return value.replace(/(sin|cos|tan)\(([^()]+)\)/gi, (_, fn, inner) => {
    return `${fn}(${inner} * pi / 180)`;
  });
};

export const normalizeExpression = (value = '') => {
  let expr = value
    .replace(/\s+/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt');

  expr = normalizeTrigDegrees(expr);

  return expr
    .replace(/(\d)(sin|cos|tan|sqrt|ln|log|exp|pi|\()/gi, '$1*$2')
    .replace(/(\))(\d)/g, '$1*$2')
    .replace(/(\))(sin|cos|tan|sqrt|ln|log|exp|pi)/gi, '$1*$2');
};

const formatResult = (value) => {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  const formatted = Number(value).toFixed(6);
  return Number(formatted).toString();
};

export async function calculateExpression(expression) {
  const raw = expression?.trim();

  if (!raw) {
    return '0';
  }

  try {
    const normalized = normalizeExpression(raw);
    const result = evaluate(normalized);

    if (!Number.isFinite(result)) {
      return 'Error';
    }

    return formatResult(result);
  } catch {
    return 'Error';
  }
}
