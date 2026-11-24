import type { QuestionDifficulty } from '../utils/cChallengeEval';

export interface FlashcardItem {
  id: string;
  moduleNumber: string;
  topicCode: string;
  front: string;
  back: string;
  codeSnippet?: string;
}

export interface QuizQuestion {
  id: string;
  moduleNumber: string;
  topicCode: string;
  difficulty: QuestionDifficulty;
  title: string;
  question: string;
  interpretation: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  stepByStep: string[];
  codingPrompt: string;
  starterCode: string;
  solutionCode: string;
  testStdin?: string;
  expectedOutput: string;
}

export const FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc-1.1',
    moduleNumber: '01',
    topicCode: '1.1',
    front: 'Quais são os 3 componentes centrais da CPU na arquitetura de Von Neumann e suas funções?',
    back: 'Unidade de Controle (UC, busca e decodifica instruções), ULA (executa operações aritméticas e lógicas) e Registradores (memória ultrarrápida interna da CPU).'
  },
  {
    id: 'fc-1.2',
    moduleNumber: '01',
    topicCode: '1.2',
    front: 'Como converter um número positivo para negativo em Complemento de 2 (8 bits)?',
    back: 'Inverta todos os bits (complemento de 1) e some 1 ao resultado. Ex: +5 (00000101) -> inverte (11111010) + 1 = 11111011 (-5).'
  },
  {
    id: 'fc-1.3',
    moduleNumber: '01',
    topicCode: '1.3',
    front: 'Em C, qual é a diferença entre os operadores & e &&?',
    back: '& faz operação bit a bit (bitwise AND). && é o operador lógico AND com avaliação em curto-circuito (retorna 1 ou 0).'
  },
  {
    id: 'fc-1.6',
    moduleNumber: '01',
    topicCode: '1.6',
    front: 'Quais símbolos de fluxograma representam Início/Fim, Entrada/Saída, Processamento e Decisão?',
    back: 'Terminal (oval) = Início/Fim; Paralelogramo = Entrada/Saída; Retângulo = Processamento; Losango = Decisão (condicional).'
  },
  {
    id: 'fc-2.1',
    moduleNumber: '02',
    topicCode: '2.1',
    front: 'Quais são os 4 estágios do pipeline de compilação de um programa C?',
    back: '1. Pré-processamento (#include, #define) -> 2. Compilação (para Assembly) -> 3. Montagem (código objeto .o) -> 4. Linkedição (gera o executável final).'
  },
  {
    id: 'fc-2.2',
    moduleNumber: '02',
    topicCode: '2.2',
    front: 'O que acontece se uma variável local em C for declarada sem inicialização?',
    back: 'Ela conterá "lixo de memória" (o valor residual que já estava naqueles bytes da pilha), pois C não zera variáveis locais automaticamente.'
  },
  {
    id: 'fc-2.3',
    moduleNumber: '02',
    topicCode: '2.3',
    front: 'Qual é o resultado de (5 / 2) e de (++i vs i++) em C?',
    back: '5 / 2 resulta em 2 (divisão inteira truncada). ++i incrementa antes de usar o valor na expressão; i++ usa o valor atual e incrementa depois.'
  },
  {
    id: 'fc-2.4',
    moduleNumber: '02',
    topicCode: '2.4',
    front: 'Por que o scanf exige o operador & antes de variáveis primitivas (ex: scanf("%d", &x))?',
    back: 'Porque scanf precisa do ENDEREÇO de memória de x para conseguir gravar o valor lido diretamente na variável do chamador.'
  },
  {
    id: 'fc-3.2',
    moduleNumber: '03',
    topicCode: '3.2',
    front: 'O que acontece se você omitir o comando break dentro de um bloco case do switch?',
    back: 'Ocorre "fall-through": a execução continua atravessando e executando os blocos dos cases seguintes até achar um break ou o fim do switch.'
  },
  {
    id: 'fc-3.3',
    moduleNumber: '03',
    topicCode: '3.3',
    front: 'Qual é a diferença fundamental entre while e do-while?',
    back: 'while faz pré-teste (pode executar 0 vezes se a condição já for falsa). do-while faz pós-teste (garante pelo menos 1 execução).'
  },
  {
    id: 'fc-3.4',
    moduleNumber: '03',
    topicCode: '3.4',
    front: 'Qual a diferença entre break e continue dentro de um laço?',
    back: 'break encerra o laço imediatamente. continue interrompe apenas a iteração atual e salta para a próxima verificação do laço.'
  },
  {
    id: 'fc-4.2',
    moduleNumber: '04',
    topicCode: '4.2',
    front: 'Como funciona a passagem de parâmetros padrão em C?',
    back: 'Por valor (cópia). Alterar o parâmetro dentro da função não altera a variável original, a menos que se passe o endereço via ponteiro.'
  },
  {
    id: 'fc-4.3',
    moduleNumber: '04',
    topicCode: '4.3',
    front: 'Qual é o efeito da palavra-chave static em uma variável local dentro de uma função?',
    back: 'O escopo continua restrito à função, mas o tempo de vida passa a ser todo o programa: a variável mantém seu valor entre chamadas sucessivas.'
  },
  {
    id: 'fc-4.4',
    moduleNumber: '04',
    topicCode: '4.4',
    front: 'Para que servem #ifndef / #define / #endif (include guards) em arquivos .h?',
    back: 'Para evitar que o mesmo arquivo de cabeçalho seja incluído múltiplas vezes na mesma unidade de compilação, prevenindo erros de redefinição.'
  },
  {
    id: 'fc-5.1',
    moduleNumber: '05',
    topicCode: '5.1',
    front: 'Como C calcula o endereço do elemento v[i] de um vetor na memória?',
    back: 'endereço_base(v) + i * sizeof(tipo_do_elemento). Por isso os índices começam em 0 e o acesso tem tempo constante O(1).'
  },
  {
    id: 'fc-5.2',
    moduleNumber: '05',
    topicCode: '5.2',
    front: 'Em que ordem uma matriz int m[L][C] é armazenada na memória RAM física?',
    back: 'Em ordem Row-Major (linha por linha): toda a linha 0 vem primeiro, seguida pela linha 1. O deslocamento linear de m[i][j] é (i * C + j).'
  },
  {
    id: 'fc-5.3',
    moduleNumber: '05',
    topicCode: '5.3',
    front: 'Qual é a diferença entre strlen(s) e sizeof(s) para char s[20] = "Ola";?',
    back: 'strlen(s) retorna 3 (conta caracteres até encontrar o \'\\0\'). sizeof(s) retorna 20 (tamanho total alocado para o vetor em bytes).'
  },
  {
    id: 'fc-6.2',
    moduleNumber: '06',
    topicCode: '6.2',
    front: 'O que significam *p e &x em expressões com ponteiros?',
    back: '&x obtém o endereço de memória da variável x. *p (desreferenciação) acessa ou modifica o conteúdo armazenado no endereço guardado por p.'
  },
  {
    id: 'fc-6.3',
    moduleNumber: '06',
    topicCode: '6.3',
    front: 'Se int *p aponta para 0x1000 (com sizeof(int) == 4), qual endereço resulta de p + 2?',
    back: '0x1008! A aritmética de ponteiros multiplica o deslocamento pelo tamanho do tipo apontado (2 * 4 = 8 bytes).'
  },
  {
    id: 'fc-7.1',
    moduleNumber: '07',
    topicCode: '7.1',
    front: 'Por que gravar o inteiro 123456 em arquivo binário costuma ocupar menos bytes que em texto?',
    back: 'Em texto ocupa 6 bytes (6 caracteres ASCII). Em binário (fwrite de um int de 32 bits), qualquer int dentro da faixa ocupa exatamente 4 bytes fixos.'
  },
  {
    id: 'fc-7.3',
    moduleNumber: '07',
    topicCode: '7.3',
    front: 'O que ocorre ao abrir um arquivo já existente usando fopen("dados.txt", "w")?',
    back: 'O modo "w" trunca (apaga) todo o conteúdo anterior do arquivo imediatamente! Para preservar e escrever no final, use "a" (append).'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // NÍVEL FÁCIL (4 questões)
  {
    id: 'q-f1',
    moduleNumber: '01',
    topicCode: '1.2',
    difficulty: 'facil',
    title: 'Conversão de base e representação hexadecimal',
    question:
      'Um registrador de 8 bits armazena o valor binário 00101010. Qual é o valor decimal sem sinal e sua representação hexadecimal em C?',
    interpretation:
      'Cada posição binária da direita para a esquerda vale 2^0, 2^1, ..., 2^7. Para converter diretamente para hexadecimal, divida os 8 bits em dois blocos de 4 bits (nibbles): 0010 e 1010.',
    options: [
      '42 em decimal e 0x2A em hexadecimal',
      '38 em decimal e 0x26 em hexadecimal',
      '44 em decimal e 0x2C em hexadecimal',
      '42 em decimal e 0x42 em hexadecimal'
    ],
    correctIndex: 0,
    explanation:
      'Os bits ligados estão nas posições 2^5 (32), 2^3 (8) e 2^1 (2), somando 42. Em hexadecimal, 0010 vale 2 e 1010 vale 10 (A).',
    stepByStep: [
      'Liste os pesos dos 8 bits: 128, 64, 32, 16, 8, 4, 2, 1.',
      'Para 00101010, some apenas onde o bit é 1: 32 + 8 + 2 = 42.',
      'Separe em 2 nibbles: 0010 (2) e 1010 (8 + 2 = 10, representado por A).',
      'Junte os dígitos hexadecimais: 0x2A.'
    ],
    codingPrompt:
      'Complete o programa em C declarando o literal hexadecimal 0x2A na variável valor e imprimindo decimal e hexadecimal maiúsculo no formato: "42 2A".',
    starterCode: `#include <stdio.h>

int main(void) {
    int valor = 0; // Altere para o literal hexadecimal 0x2A
    printf("%d %X\\n", valor, valor);
    return 0;
}`,
    solutionCode: `#include <stdio.h>

int main(void) {
    int valor = 0x2A;
    printf("%d %X\\n", valor, valor);
    return 0;
}`,
    expectedOutput: '42 2A'
  },
  {
    id: 'q-f2',
    moduleNumber: '02',
    topicCode: '2.4',
    difficulty: 'facil',
    title: 'Formatação de saída com printf',
    question:
      'Um sistema de caixa precisa exibir o preço unitário 19.5 com exatamente duas casas decimais e o código 7 preenchido com zeros à esquerda até 3 dígitos. Qual chamada printf produz "007 19.50"?',
    interpretation:
      'Os especificadores de largura e precisão em printf controlam alinhamento e arredondamento: %0Nd preenche inteiros com zeros até N casas e %.Mf fixa M casas decimais em float/double.',
    options: [
      'printf("%03d %.2f\\n", 7, 19.5);',
      'printf("%3d %2f\\n", 7, 19.5);',
      'printf("%03f %.2d\\n", 7, 19.5);',
      'printf("%d %.2f\\n", 7, 19.5);'
    ],
    correctIndex: 0,
    explanation:
      '%03d garante largura mínima de 3 dígitos preenchida com zeros à esquerda (007), e %.2f exibe exatamente 2 casas após o ponto (19.50).',
    stepByStep: [
      'Analise o primeiro campo: o número 7 precisa aparecer como "007" (3 dígitos, preenchimento com zero -> %03d).',
      'Analise o segundo campo: 19.5 precisa aparecer como "19.50" (ponto flutuante com 2 casas -> %.2f).',
      'Combine os dois separados por espaço simples: "%03d %.2f\\n".'
    ],
    codingPrompt:
      'Ajuste a linha do printf abaixo para imprimir exatamente "007 19.50".',
    starterCode: `#include <stdio.h>

int main(void) {
    int codigo = 7;
    double preco = 19.5;
    printf("%d %f\\n", codigo, preco);
    return 0;
}`,
    solutionCode: `#include <stdio.h>

int main(void) {
    int codigo = 7;
    double preco = 19.5;
    printf("%03d %.2f\\n", codigo, preco);
    return 0;
}`,
    expectedOutput: '007 19.50'
  },
  {
    id: 'q-f3',
    moduleNumber: '03',
    topicCode: '3.1',
    difficulty: 'facil',
    title: 'Estrutura sequencial e troca de variáveis (Swap)',
    question:
      'Um programador deseja trocar os valores de a = 15 e b = 30. Se ele escrever apenas "a = b; b = a;", o que acontecerá?',
    interpretation:
      'A execução sequencial sobrescreve o conteúdo anterior da variável à esquerda do sinal =. Sem uma variável temporária, o valor original de a é perdido na primeira linha.',
    options: [
      'Ambas as variáveis terminarão valendo 30',
      'a valerá 30 e b valerá 15',
      'Ambas as variáveis terminarão valendo 15',
      'O compilador GCC acusará erro de sintaxe'
    ],
    correctIndex: 0,
    explanation:
      'Na linha a = b, o valor 15 é apagado e a passa a valer 30. Em seguida, b = a copia 30 de volta para b.',
    stepByStep: [
      'Estado inicial: a = 15, b = 30.',
      'Para não perder o 15, salve-o primeiro: temp = a (temp = 15).',
      'Copie b para a: a = b (a = 30).',
      'Recupere o valor salvo em temp para b: b = temp (b = 15).'
    ],
    codingPrompt:
      'Implemente a troca usando a variável temp para que o programa imprima "a=30 b=15".',
    starterCode: `#include <stdio.h>

int main(void) {
    int a = 15, b = 30, temp;
    // Complete a troca aqui usando temp
    a = b;
    b = a;
    printf("a=%d b=%d\\n", a, b);
    return 0;
}`,
    solutionCode: `#include <stdio.h>

int main(void) {
    int a = 15, b = 30, temp;
    temp = a;
    a = b;
    b = temp;
    printf("a=%d b=%d\\n", a, b);
    return 0;
}`,
    expectedOutput: 'a=30 b=15'
  },
  {
    id: 'q-f4',
    moduleNumber: '05',
    topicCode: '5.1',
    difficulty: 'facil',
    title: 'Indexação base-0 e soma de elementos de um vetor',
    question:
      'Dado int v[4] = {4, 8, 12, 16};, qual índice acessa o terceiro elemento (12) e qual é a soma total do vetor?',
    interpretation:
      'Em C, os índices de um vetor de tamanho N vão de 0 até N - 1. Portanto, o 1º elemento está em v[0], o 2º em v[1] e o 3º em v[2].',
    options: [
      'Índice v[2] e soma igual a 40',
      'Índice v[3] e soma igual a 40',
      'Índice v[2] e soma igual a 36',
      'Índice v[3] e soma igual a 24'
    ],
    correctIndex: 0,
    explanation:
      'v[2] corresponde ao terceiro elemento (12). Somando todos: 4 + 8 + 12 + 16 = 40.',
    stepByStep: [
      'Mapeie os índices: v[0]=4, v[1]=8, v[2]=12, v[3]=16.',
      'Percorra com for (int i = 0; i < 4; i++) acumulando soma += v[i].',
      'Valores acumulados: 0+4=4 -> +8=12 -> +12=24 -> +16=40.',
      'Imprima o terceiro elemento v[2] e a soma total.'
    ],
    codingPrompt:
      'Complete o laço for para calcular a soma e imprimir "12 40".',
    starterCode: `#include <stdio.h>

int main(void) {
    int v[4] = {4, 8, 12, 16};
    int soma = 0;
    // Percorra o vetor de 0 até 3 acumulando em soma
    printf("%d %d\\n", v[2], soma);
    return 0;
}`,
    solutionCode: `#include <stdio.h>

int main(void) {
    int v[4] = {4, 8, 12, 16};
    int soma = 0;
    for (int i = 0; i < 4; i++) {
        soma += v[i];
    }
    printf("%d %d\\n", v[2], soma);
    return 0;
}`,
    expectedOutput: '12 40'
  },

  // NÍVEL MÉDIA (4 questões)
  {
    id: 'q-m1',
    moduleNumber: '02',
    topicCode: '2.3',
    difficulty: 'media',
    title: 'Divisão inteira e operador de pós-incremento',
    question: 'Qual será a saída exata do trecho em C abaixo?',
    interpretation:
      'Observe dois comportamentos fundamentais de C: (1) dividir dois valores int descarta a parte decimal sem arredondar; (2) a++ retorna o valor atual de a antes de incrementá-lo.',
    codeSnippet: `int a = 7, b = 2;
int x = a / b;
int y = a++;
printf("%d %d %d", x, y, a);`,
    options: ['3 7 8', '3 8 8', '3.5 7 8', '3 7 7'],
    correctIndex: 0,
    explanation:
      '7 / 2 entre inteiros resulta em 3. Depois, y recebe 7 (valor antigo de a) e somente após a atribuição a passa a valer 8.',
    stepByStep: [
      'Inicialização: a = 7, b = 2.',
      'int x = a / b -> 7 / 2 como inteiros trunca o 0.5, resultando em x = 3.',
      'int y = a++ -> pós-incremento entrega o valor atual (7) para y e só então soma 1 em a.',
      'Estado final: x = 3, y = 7, a = 8 -> saída "3 7 8".'
    ],
    codingPrompt:
      'Execute ou modifique o programa para confirmar a saída exata "3 7 8". Experimente testar ++a para ver a diferença.',
    starterCode: `#include <stdio.h>

int main(void) {
    int a = 7, b = 2;
    int x = a / b;
    int y = a++;
    printf("%d %d %d\\n", x, y, a);
    return 0;
}`,
    solutionCode: `#include <stdio.h>

int main(void) {
    int a = 7, b = 2;
    int x = a / b;
    int y = a++;
    printf("%d %d %d\\n", x, y, a);
    return 0;
}`,
    expectedOutput: '3 7 8'
  },
  {
    id: 'q-m2',
    moduleNumber: '03',
    topicCode: '3.4',
    difficulty: 'media',
    title: 'Interpretação de fluxo com continue e break',
    question:
      'Considere o laço abaixo com desvios condicionais. Qual sequência será impressa?',
    interpretation:
      'continue interrompe somente a iteração atual e força o laço for a ir para o incremento (i++). Já break abandona o laço imediatamente.',
    codeSnippet: `for (int i = 1; i <= 5; i++) {
    if (i == 2) continue;
    if (i == 4) break;
    printf("%d", i);
}`,
    options: ['13', '123', '135', '1'],
    correctIndex: 0,
    explanation:
      'Para i=1 imprime 1; i=2 executa continue (pula printf); i=3 imprime 3; i=4 executa break e encerra o laço antes de chegar em 5.',
    stepByStep: [
      'i = 1: não é 2 nem 4 -> imprime "1".',
      'i = 2: (i == 2) verdadeiro -> continue pula o printf e vai para i++.',
      'i = 3: não é 2 nem 4 -> imprime "3".',
      'i = 4: (i == 4) verdadeiro -> break encerra o laço for. Resultado final: "13".'
    ],
    codingPrompt:
      'Complete o laço inserindo os comandos continue e break nas condições corretas para imprimir "13".',
    starterCode: `#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 5; i++) {
        // Adicione if (i == 2) continue; e if (i == 4) break;
        printf("%d", i);
    }
    printf("\\n");
    return 0;
}`,
    solutionCode: `#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 5; i++) {
        if (i == 2) continue;
        if (i == 4) break;
        printf("%d", i);
    }
    printf("\\n");
    return 0;
}`,
    expectedOutput: '13'
  },
  {
    id: 'q-m3',
    moduleNumber: '03',
    topicCode: '3.2',
    difficulty: 'media',
    title: 'Comportamento fall-through no switch-case',
    question:
      'Se a variável opcao valer 2 no código abaixo, qual será o valor final de total?',
    interpretation:
      'Quando um case não possui break ao final, a execução "escorrega" (fall-through) para o case seguinte, executando os comandos dele também, até encontrar um break ou o fim do bloco switch.',
    codeSnippet: `int opcao = 2, total = 0;
switch (opcao) {
    case 1: total += 10;
    case 2: total += 20;
    case 3: total += 5; break;
    default: total += 100;
}`,
    options: ['25', '20', '125', '35'],
    correctIndex: 0,
    explanation:
      'A execução entra em case 2 (total = 20), não encontra break, continua em case 3 (total = 25) e só então para no break.',
    stepByStep: [
      'opcao vale 2, portanto o switch salta diretamente para "case 2:".',
      'Executa total += 20 -> total passa de 0 para 20.',
      'Como não há break em case 2, o fluxo continua para "case 3:".',
      'Executa total += 5 -> total vira 25, e então "break;" sai do switch sem entrar em default.'
    ],
    codingPrompt:
      'Escreva um switch com opcao = 2 reproduzindo esse comportamento ou teste com break em case 2, e garanta que a saída do desafio seja "25".',
    starterCode: `#include <stdio.h>

int main(void) {
    int opcao = 2, total = 0;
    switch (opcao) {
        case 1: total += 10;
        case 2: total += 20;
        case 3: total += 5; break;
        default: total += 100;
    }
    printf("%d\\n", total);
    return 0;
}`,
    solutionCode: `#include <stdio.h>

int main(void) {
    int opcao = 2, total = 0;
    switch (opcao) {
        case 1: total += 10;
        case 2: total += 20;
        case 3: total += 5; break;
        default: total += 100;
    }
    printf("%d\\n", total);
    return 0;
}`,
    expectedOutput: '25'
  },
  {
    id: 'q-m4',
    moduleNumber: '04',
    topicCode: '4.3',
    difficulty: 'media',
    title: 'Tempo de vida: variável local vs static',
    question:
      'Qual será a saída após chamar a função contar() duas vezes consecutivas?',
    interpretation:
      'Variáveis locais comuns são recriadas na pilha a cada chamada da função. Já variáveis declaradas com static são inicializadas uma única vez e mantêm seu estado entre chamadas.',
    codeSnippet: `void contar(void) {
    static int s = 5;
    int n = 5;
    s++; n++;
    printf("%d-%d ", s, n);
}`,
    options: ['6-6 7-6', '6-6 7-7', '6-6 6-6', '5-5 6-5'],
    correctIndex: 0,
    explanation:
      'Na 1ª chamada: s vira 6, n vira 6 (6-6). Na 2ª chamada: s preserva 6 e vira 7, enquanto n é recriado em 5 e vira 6 (7-6).',
    stepByStep: [
      'Antes da 1ª chamada: s (estática) nasce com valor 5.',
      '1ª chamada de contar(): n nasce com 5. s++ (6) e n++ (6). Imprime "6-6 ". n é destruída.',
      '2ª chamada de contar(): s ainda vale 6! n é criada novamente com 5.',
      's++ (7) e n++ (6). Imprime "7-6 ". Saída completa: "6-6 7-6".'
    ],
    codingPrompt:
      'Complete a variável s com o modificador static para que o programa imprima "6-6 7-6".',
    starterCode: `#include <stdio.h>

void contar(void) {
    int s = 5; // Adicione static aqui!
    int n = 5;
    s++;
    n++;
    printf("%d-%d ", s, n);
}

int main(void) {
    contar();
    contar();
    printf("\\n");
    return 0;
}`,
    solutionCode: `#include <stdio.h>

void contar(void) {
    static int s = 5;
    int n = 5;
    s++;
    n++;
    printf("%d-%d ", s, n);
}

int main(void) {
    contar();
    contar();
    printf("\\n");
    return 0;
}`,
    expectedOutput: '6-6 7-6'
  },

  // NÍVEL DIFÍCIL (4 questões)
  {
    id: 'q-d1',
    moduleNumber: '05',
    topicCode: '5.3',
    difficulty: 'dificil',
    title: 'Strings, terminador nulo \\0 e strlen vs sizeof',
    question:
      'Considere char palavra[15] = "C_Avancado";. Qual será o resultado de strlen(palavra) e sizeof(palavra), e por que não devemos comparar strings com ==?',
    interpretation:
      'strlen() percorre os bytes a partir do início até encontrar o caractere nulo \'\\0\', retornando apenas a quantidade de caracteres visíveis. Já sizeof() retorna o tamanho total reservado em bytes para o vetor.',
    options: [
      'strlen = 10, sizeof = 15; == compara endereços, deve-se usar strcmp()',
      'strlen = 11, sizeof = 15; == compara caracteres até \\0',
      'strlen = 15, sizeof = 15; == funciona para vetores fixos',
      'strlen = 10, sizeof = 11; == compara valores ASCII'
    ],
    correctIndex: 0,
    explanation:
      '"C_Avancado" possui 10 caracteres antes do \'\\0\', logo strlen vale 10, enquanto o vetor alocado tem 15 bytes (sizeof = 15).',
    stepByStep: [
      'Conte os caracteres de "C_Avancado": C(1) _(2) A(3) v(4) a(5) n(6) c(7) a(8) d(9) o(10).',
      'O terminador \'\\0\' fica no índice 10, e strlen() não o inclui na contagem -> strlen = 10.',
      'O vetor foi declarado como char palavra[15], logo sizeof(palavra) = 15 bytes.',
      'Para comparar conteúdo de duas strings em C, usamos strcmp(s1, s2) == 0.'
    ],
    codingPrompt:
      'Complete o programa usando strlen() e strcmp() para imprimir "10 15 IGUAL".',
    starterCode: `#include <stdio.h>
#include <string.h>

int main(void) {
    char palavra[15] = "C_Avancado";
    size_t tam = 0; // Use strlen(palavra)
    int igual = 0;  // Use strcmp(palavra, "C_Avancado") == 0
    printf("%zu %zu %s\\n", tam, sizeof(palavra), igual ? "IGUAL" : "DIFERENTE");
    return 0;
}`,
    solutionCode: `#include <stdio.h>
#include <string.h>

int main(void) {
    char palavra[15] = "C_Avancado";
    size_t tam = strlen(palavra);
    int igual = strcmp(palavra, "C_Avancado") == 0;
    printf("%zu %zu %s\\n", tam, sizeof(palavra), igual ? "IGUAL" : "DIFERENTE");
    return 0;
}`,
    expectedOutput: '10 15 IGUAL'
  },
  {
    id: 'q-d2',
    moduleNumber: '06',
    topicCode: '6.2',
    difficulty: 'dificil',
    title: 'Redirecionamento e indireção de ponteiros (*p e &)',
    question:
      'Analise o código com ponteiros abaixo. Quais serão os valores finais de x e y?',
    interpretation:
      'Acompanhe para qual endereço p está apontando em cada instante. Alterar *p modifica a variável cujo endereço está guardado dentro de p naquele momento.',
    codeSnippet: `int x = 10, y = 20;
int *p = &x;
*p = 30;
p = &y;
*p = *p + x;`,
    options: [
      'x = 30 e y = 50',
      'x = 10 e y = 30',
      'x = 50 e y = 20',
      'x = 30 e y = 30'
    ],
    correctIndex: 0,
    explanation:
      '*p = 30 modifica x para 30. Em seguida p passa a apontar para y, e *p = *p + x soma 20 + 30 e grava 50 em y.',
    stepByStep: [
      'Inicialmente: x = 10, y = 20.',
      'int *p = &x; -> p armazena o endereço de x.',
      '*p = 30; -> desreferencia p (acessa x) e grava 30 em x.',
      'p = &y; -> redireciona p para apontar para y (que vale 20).',
      '*p = *p + x; -> lê *p (y = 20) + x (30) = 50, gravando 50 em y.'
    ],
    codingPrompt:
      'Implemente a sequência de ponteiros para imprimir "30 50".',
    starterCode: `#include <stdio.h>

int main(void) {
    int x = 10, y = 20;
    int *p = &x;
    // Altere *p para 30, depois aponte p para &y e some x em *p
    printf("%d %d\\n", x, y);
    return 0;
}`,
    solutionCode: `#include <stdio.h>

int main(void) {
    int x = 10, y = 20;
    int *p = &x;
    *p = 30;
    p = &y;
    *p = *p + x;
    printf("%d %d\\n", x, y);
    return 0;
}`,
    expectedOutput: '30 50'
  },
  {
    id: 'q-d3',
    moduleNumber: '04',
    topicCode: '4.1',
    difficulty: 'dificil',
    title: 'Pilha de chamadas recursiva (Call Stack)',
    question:
      'Na função recursiva abaixo, quantas chamadas são empilhadas no total para calcular misterio(4) e qual valor é retornado?',
    interpretation:
      'Cada chamada recursiva cria um quadro na pilha até atingir o caso base (n <= 1). O retorno vai sendo acumulado de baixo para cima ao desempilhar.',
    codeSnippet: `int misterio(int n) {
    if (n <= 1) return 1;
    return n + misterio(n - 1);
}`,
    options: [
      '4 chamadas no total; retorna 10',
      '5 chamadas no total; retorna 10',
      '4 chamadas no total; retorna 24',
      '3 chamadas no total; retorna 9'
    ],
    correctIndex: 0,
    explanation:
      'Empilha misterio(4) -> misterio(3) -> misterio(2) -> misterio(1) (4 quadros). O retorno soma 1 + 2 + 3 + 4 = 10.',
    stepByStep: [
      'Chamada 1: misterio(4) aguarda 4 + misterio(3).',
      'Chamada 2: misterio(3) aguarda 3 + misterio(2).',
      'Chamada 3: misterio(2) aguarda 2 + misterio(1).',
      'Chamada 4: misterio(1) atinge o caso base (n <= 1) e retorna 1.',
      'Desempilhando: 2+1=3 -> 3+3=6 -> 4+6=10.'
    ],
    codingPrompt:
      'Escreva a função recursiva misterio(int n) e teste misterio(4) para imprimir "10".',
    starterCode: `#include <stdio.h>

int misterio(int n) {
    // Implemente o caso base e o passo recursivo
    return 0;
}

int main(void) {
    printf("%d\\n", misterio(4));
    return 0;
}`,
    solutionCode: `#include <stdio.h>

int misterio(int n) {
    if (n <= 1) return 1;
    return n + misterio(n - 1);
}

int main(void) {
    printf("%d\\n", misterio(4));
    return 0;
}`,
    expectedOutput: '10'
  },
  {
    id: 'q-d4',
    moduleNumber: '05',
    topicCode: '5.2',
    difficulty: 'dificil',
    title: 'Matriz 2D, diagonal secundária e ordem Row-Major',
    question:
      'Em uma matriz quadrada int m[3][3], qual é a soma dos elementos da diagonal principal (i == j) e qual o deslocamento linear Row-Major de m[2][1]?',
    interpretation:
      'A diagonal principal reúne os elementos onde o índice da linha é igual ao da coluna (m[0][0], m[1][1], m[2][2]). O deslocamento linear na RAM é (linha * num_colunas + coluna).',
    codeSnippet: `int m[3][3] = {
    {2, 4, 6},
    {1, 5, 9},
    {3, 7, 8}
};`,
    options: [
      'Soma da diagonal = 15; deslocamento linear de m[2][1] = 7',
      'Soma da diagonal = 14; deslocamento linear de m[2][1] = 5',
      'Soma da diagonal = 15; deslocamento linear de m[2][1] = 6',
      'Soma da diagonal = 12; deslocamento linear de m[2][1] = 7'
    ],
    correctIndex: 0,
    explanation:
      'Diagonal principal: m[0][0]=2, m[1][1]=5, m[2][2]=8 (soma 15). O índice linear de m[2][1] em 3 colunas é 2 * 3 + 1 = 7 (elemento 7).',
    stepByStep: [
      'Identifique a diagonal principal (i == j): m[0][0]=2, m[1][1]=5, m[2][2]=8.',
      'Soma = 2 + 5 + 8 = 15.',
      'Calcule o offset Row-Major de m[2][1] com C = 3: (2 * 3) + 1 = 7.',
      'Conferindo no vetor achatado: [2,4,6, 1,5,9, 3,7,8] -> índice 7 vale 7.'
    ],
    codingPrompt:
      'Calcule a soma da diagonal principal da matriz m[3][3] e imprima "15 7" (soma e valor em *(&m[0][0] + 7)).',
    starterCode: `#include <stdio.h>

int main(void) {
    int m[3][3] = {
        {2, 4, 6},
        {1, 5, 9},
        {3, 7, 8}
    };
    int diag = 0;
    // Some os elementos da diagonal principal (i == j)
    int linear = *(&m[0][0] + 7);
    printf("%d %d\\n", diag, linear);
    return 0;
}`,
    solutionCode: `#include <stdio.h>

int main(void) {
    int m[3][3] = {
        {2, 4, 6},
        {1, 5, 9},
        {3, 7, 8}
    };
    int diag = 0;
    for (int i = 0; i < 3; i++) {
        diag += m[i][i];
    }
    int linear = *(&m[0][0] + 7);
    printf("%d %d\\n", diag, linear);
    return 0;
}`,
    expectedOutput: '15 7'
  },

  // NÍVEL COMPLEXA COM INTERPRETAÇÃO (4 questões)
  {
    id: 'q-c1',
    moduleNumber: '06',
    topicCode: '6.3',
    difficulty: 'complexa',
    title: 'Aritmética de ponteiros combinada com pós-incremento (*p++)',
    question:
      'Interprete com atenção a precedência de operadores em C: no código abaixo, qual será a saída impressa após executar *p++ = 99 e *(p + 1) += 5?',
    interpretation:
      'Os operadores unários * e ++ têm a mesma precedência e associam DA DIREITA PARA A ESQUERDA! Portanto, *p++ significa *(p++): o valor apontado pelo endereço ATUAL de p recebe 99, e p avança para o próximo int (v[1]).',
    codeSnippet: `int v[4] = {10, 20, 30, 40};
int *p = v;
*p++ = 99;
*(p + 1) += 5;
printf("%d %d %d %d", v[0], v[1], v[2], v[3]);`,
    options: [
      '99 20 35 40',
      '10 99 35 40',
      '99 25 30 40',
      '100 20 30 45'
    ],
    correctIndex: 0,
    explanation:
      '*p++ = 99 grava 99 em v[0] e avança p para &v[1]. Depois, p + 1 aponta para &v[2] (30), que recebe +5 e vira 35.',
    stepByStep: [
      'Inicialmente p aponta para v[0] (endereço base do vetor).',
      'Em *p++ = 99, o pós-incremento p++ retorna o endereço antigo (&v[0]) e só depois avança p para &v[1].',
      'Logo, *(&v[0]) = 99 altera v[0] para 99; agora p aponta para v[1].',
      'Na linha seguinte, (p + 1) calcula &v[1] + 1 = &v[2] (que vale 30).',
      '*(p + 1) += 5 soma 5 em v[2], transformando-o em 35.',
      'Vetor final: 99, 20, 35, 40.'
    ],
    codingPrompt:
      'Complete as duas operações com ponteiros no código abaixo para que a saída seja "99 20 35 40".',
    starterCode: `#include <stdio.h>

int main(void) {
    int v[4] = {10, 20, 30, 40};
    int *p = v;
    // Escreva *p++ = 99; e *(p + 1) += 5;
    printf("%d %d %d %d\\n", v[0], v[1], v[2], v[3]);
    return 0;
}`,
    solutionCode: `#include <stdio.h>

int main(void) {
    int v[4] = {10, 20, 30, 40};
    int *p = v;
    *p++ = 99;
    *(p + 1) += 5;
    printf("%d %d %d %d\\n", v[0], v[1], v[2], v[3]);
    return 0;
}`,
    expectedOutput: '99 20 35 40'
  },
  {
    id: 'q-c2',
    moduleNumber: '06',
    topicCode: '6.3',
    difficulty: 'complexa',
    title: 'Alocação dinâmica no Heap, passagem por referência e filtragem',
    question:
      'Um módulo de processamento recebe um vetor de inteiros e precisa alocar no Heap um novo vetor contendo apenas os valores pares maiores que 10, retornando o ponteiro e gravando a nova quantidade em *outLen. Qual implementação evita vazamento e acessos inválidos?',
    interpretation:
      'Como o tamanho resultante só é conhecido em tempo de execução, usamos passagem por referência (int *outLen) para devolver a contagem ao chamador e malloc() para retornar o endereço do bloco no Heap (que o chamador deverá liberar com free()).',
    options: [
      'Contar os pares > 10, alocar com malloc(count * sizeof(int)), preencher, gravar *outLen = count e liberar com free() no main',
      'Criar um vetor local int res[100] dentro da função e retornar &res[0]',
      'Alocar com malloc(n) bytes sem multiplicar por sizeof(int)',
      'Liberar free(res) antes do return dentro da própria função'
    ],
    correctIndex: 0,
    explanation:
      'Retornar vetor local gera dangling pointer (a pilha é destruída ao sair da função). Alocar no Heap com tamanho exato * sizeof(int) e devolver o ponteiro para o chamador liberar com free() é o padrão seguro em C.',
    stepByStep: [
      'Passo 1: Percorra o vetor de entrada para contar quantos elementos satisfazem (v[i] % 2 == 0 && v[i] > 10).',
      'Passo 2: Grave essa quantidade no endereço recebido via ponteiro: *outLen = count.',
      'Passo 3: Aloque no Heap: int *res = malloc(count * sizeof(int)); verificando se res != NULL.',
      'Passo 4: Copie os elementos filtrados para res e retorne res.',
      'Passo 5: No main(), imprima os elementos e chame free(res); res = NULL;.'
    ],
    codingPrompt:
      'Implemente a função filtrarParesMaioresQue10 e o free() no main para filtrar {5, 12, 8, 18, 21, 14} e imprimir "3: 12 18 14".',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

int* filtrarParesMaioresQue10(const int *v, int n, int *outLen) {
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (v[i] % 2 == 0 && v[i] > 10) count++;
    }
    *outLen = count;
    // Aloque o bloco no Heap, preencha apenas os pares > 10 e retorne o ponteiro
    return NULL;
}

int main(void) {
    int dados[6] = {5, 12, 8, 18, 21, 14};
    int qtd = 0;
    int *filtrados = filtrarParesMaioresQue10(dados, 6, &qtd);
    if (filtrados == NULL) return 1;
    printf("%d:", qtd);
    for (int i = 0; i < qtd; i++) {
        printf(" %d", filtrados[i]);
    }
    printf("\\n");
    free(filtrados);
    return 0;
}`,
    solutionCode: `#include <stdio.h>
#include <stdlib.h>

int* filtrarParesMaioresQue10(const int *v, int n, int *outLen) {
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (v[i] % 2 == 0 && v[i] > 10) count++;
    }
    *outLen = count;
    int *res = (int*) malloc((size_t)count * sizeof(int));
    if (res == NULL) return NULL;
    int k = 0;
    for (int i = 0; i < n; i++) {
        if (v[i] % 2 == 0 && v[i] > 10) {
            res[k++] = v[i];
        }
    }
    return res;
}

int main(void) {
    int dados[6] = {5, 12, 8, 18, 21, 14};
    int qtd = 0;
    int *filtrados = filtrarParesMaioresQue10(dados, 6, &qtd);
    if (filtrados == NULL) return 1;
    printf("%d:", qtd);
    for (int i = 0; i < qtd; i++) {
        printf(" %d", filtrados[i]);
    }
    printf("\\n");
    free(filtrados);
    return 0;
}`,
    expectedOutput: '3: 12 18 14'
  },
  {
    id: 'q-c3',
    moduleNumber: '05',
    topicCode: '5.3',
    difficulty: 'complexa',
    title: 'Inversão in-place de string com dois ponteiros',
    question:
      'Dada uma string s = "PONTEIRO", uma função recebe char *s e precisa invertê-la no próprio vetor (in-place) sem alocar vetor auxiliar e preservando o \'\\0\'. Qual par de índices deve ser trocado a cada passo?',
    interpretation:
      'Usando dois ponteiros (ou índices) — esq no índice 0 e dir no índice strlen(s) - 1 (logo antes do \'\\0\') — trocamos *esq com *dir enquanto esq < dir, aproximando ambos até o centro.',
    options: [
      'Trocar *esq e *dir iniciando dir em s + strlen(s) - 1, avançando esq++ e recuando dir-- enquanto esq < dir',
      'Trocar desde strlen(s) incluindo o \'\\0\' na posição 0',
      'Copiar s = "ORIETNOP" diretamente sobre o ponteiro char *s',
      'Usar apenas um laço de 0 até strlen(s) trocando s[i] com s[strlen(s) - i]'
    ],
    correctIndex: 0,
    explanation:
      'Se incluirmos o \'\\0\' na troca, ele irá para o índice 0 e a string ficará vazia! E se percorrermos até o fim sem parar no meio (esq < dir), inverteremos duas vezes voltando ao original.',
    stepByStep: [
      'Defina char *esq = s e char *dir = s + strlen(s) - 1 (aponta para o último caractere útil \'O\').',
      'Enquanto esq < dir: salve tmp = *esq; *esq = *dir; *dir = tmp;.',
      'Avance esq++ e recue dir--.',
      'Trocas: P<->O, O<->R, N<->I, T<->E -> resultado "ORIETNOP", com \'\\0\' intacto no final!'
    ],
    codingPrompt:
      'Implemente inverterString(char *s) in-place com ponteiros para que "PONTEIRO" vire "ORIETNOP".',
    starterCode: `#include <stdio.h>
#include <string.h>

void inverterString(char *s) {
    char *esq = s;
    char *dir = s + strlen(s) - 1;
    // Complete o laço while (esq < dir) trocando *esq e *dir
}

int main(void) {
    char texto[] = "PONTEIRO";
    inverterString(texto);
    printf("%s\\n", texto);
    return 0;
}`,
    solutionCode: `#include <stdio.h>
#include <string.h>

void inverterString(char *s) {
    char *esq = s;
    char *dir = s + strlen(s) - 1;
    while (esq < dir) {
        char tmp = *esq;
        *esq = *dir;
        *dir = tmp;
        esq++;
        dir--;
    }
}

int main(void) {
    char texto[] = "PONTEIRO";
    inverterString(texto);
    printf("%s\\n", texto);
    return 0;
}`,
    expectedOutput: 'ORIETNOP'
  },
  {
    id: 'q-c4',
    moduleNumber: '07',
    topicCode: '7.4',
    difficulty: 'complexa',
    title: 'Leitura segura de arquivo até EOF e armadilha do feof()',
    question:
      'Um arquivo temporário contém três notas: "8.0\\n7.5\\n9.5\\n". Por que usar while (!feof(fp)) { fscanf(fp, "%lf", &n); soma += n; } gera resultado errado, e qual é a forma correta em C?',
    interpretation:
      'A flag EOF só é ativada DEPOIS que uma tentativa de leitura falha por atingir o fim do arquivo. Assim, após ler 9.5, feof(fp) ainda é falso (0), o laço entra uma 4ª vez, fscanf falha deixando n = 9.5 inalterado e soma 9.5 duas vezes!',
    options: [
      'Testar o próprio retorno de fscanf(fp, "%lf", &n) == 1 dentro do while',
      'Abrir o arquivo com modo "w+" em vez de "r"',
      'Usar rewind(fp) ao final de cada iteração',
      'Testar if (fp != NULL) dentro do while (!feof(fp))'
    ],
    correctIndex: 0,
    explanation:
      'Testar while (fscanf(fp, "%lf", &n) == 1) garante que o corpo do laço só processe n quando uma conversão válida realmente ocorreu.',
    stepByStep: [
      'Abra um arquivo de teste em modo "w", grave 8.0, 7.5 e 9.5 e feche com fclose(fp).',
      'Reabra em modo "r" verificando se fp != NULL.',
      'Use while (fscanf(fp, "%lf", &nota) == 1) para acumular apenas leituras bem-sucedidas.',
      'Soma exata: 8.0 + 7.5 + 9.5 = 25.00; Média = 25.00 / 3 = 8.33.'
    ],
    codingPrompt:
      'Complete a leitura do arquivo usando while (fscanf(fp, "%lf", &nota) == 1) para calcular e imprimir "25.00 8.33".',
    starterCode: `#include <stdio.h>

int main(void) {
    FILE *fp = fopen("notas_teste.txt", "w");
    if (!fp) return 1;
    fprintf(fp, "8.0\\n7.5\\n9.5\\n");
    fclose(fp);

    fp = fopen("notas_teste.txt", "r");
    if (!fp) return 1;

    double nota, soma = 0.0;
    int qtd = 0;
    // Leia com while (fscanf(fp, "%lf", &nota) == 1) acumulando soma e qtd
    fclose(fp);

    printf("%.2f %.2f\\n", soma, qtd > 0 ? soma / qtd : 0.0);
    return 0;
}`,
    solutionCode: `#include <stdio.h>

int main(void) {
    FILE *fp = fopen("notas_teste.txt", "w");
    if (!fp) return 1;
    fprintf(fp, "8.0\\n7.5\\n9.5\\n");
    fclose(fp);

    fp = fopen("notas_teste.txt", "r");
    if (!fp) return 1;

    double nota, soma = 0.0;
    int qtd = 0;
    while (fscanf(fp, "%lf", &nota) == 1) {
        soma += nota;
        qtd++;
    }
    fclose(fp);

    printf("%.2f %.2f\\n", soma, qtd > 0 ? soma / qtd : 0.0);
    return 0;
}`,
    expectedOutput: '25.00 8.33'
  }
];
