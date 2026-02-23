import type { RenderContext } from '../../types.js';
import { dim, cyan, yellow } from '../colors.js';

function maskToken(token: string | undefined): string {
  if (!token || token.length <= 12) {
    return '***';
  }
  const prefix = token.slice(0, 6);
  const suffix = token.slice(-6);
  return `${prefix}...${suffix}`;
}

export function renderApiEnvLine(ctx: RenderContext): string | null {
  const display = ctx.config?.display;

  if (display?.showApiEnv === false) {
    return null;
  }

  const baseUrl = process.env.ANTHROPIC_BASE_URL;
  const authToken = process.env.ANTHROPIC_AUTH_TOKEN;
  const model = process.env.ANTHROPIC_MODEL;

  const parts: string[] = [];

  if (baseUrl) {
    parts.push(`${dim('URL:')} ${cyan(baseUrl)}`);
  }

  if (authToken) {
    parts.push(`${dim('Token:')} ${yellow(maskToken(authToken))}`);
  }

  if (model) {
    parts.push(`${dim('Model:')} ${cyan(model)}`);
  }

  if (parts.length === 0) {
    return null;
  }

  return parts.join(` ${dim('|')} `);
}
