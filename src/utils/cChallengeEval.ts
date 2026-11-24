export type QuestionDifficulty = 'facil' | 'media' | 'dificil' | 'complexa';

export interface CompileRunResponse {
  compiled: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  durationMs: number;
}

export interface ChallengeVerification {
  passed: boolean;
  statusLabel: string;
  details: string;
}

export function normalizeOutput(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

export function verifyChallengeRun(
  runResult: CompileRunResponse,
  expectedOutput: string
): ChallengeVerification {
  if (!runResult.compiled) {
    return {
      passed: false,
      statusLabel: 'Erro de compilação',
      details:
        'O compilador GCC encontrou erros de sintaxe ou tipo no seu código. Leia as mensagens do compilador abaixo e ajuste o código.',
    };
  }

  if (runResult.timedOut) {
    return {
      passed: false,
      statusLabel: 'Tempo limite excedido',
      details:
        'O programa demorou mais de 2,5 segundos (possível laço infinito ou espera por entrada não fornecida).',
    };
  }

  if (runResult.exitCode !== 0) {
    return {
      passed: false,
      statusLabel: `Execução encerrada com código ${runResult.exitCode}`,
      details:
        'O código compilou, mas terminou com erro em tempo de execução (verifique return 0, ponteiros ou divisão por zero).',
    };
  }

  const actual = normalizeOutput(runResult.stdout);
  const expected = normalizeOutput(expectedOutput);

  if (actual === expected) {
    return {
      passed: true,
      statusLabel: 'Correto e rodando',
      details:
        'Seu programa compilou sem erros no GCC, executou normalmente e produziu a saída exata esperada.',
    };
  }

  return {
    passed: false,
    statusLabel: 'Saída diferente do esperado',
    details: `Esperado: "${expected}" · Obtido: "${actual || '(saída vazia)'}".`,
  };
}

export const DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  facil: 'Fácil',
  media: 'Média',
  dificil: 'Difícil',
  complexa: 'Complexa',
};
