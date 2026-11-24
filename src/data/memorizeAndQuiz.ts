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
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
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
  {
    id: 'q-1',
    moduleNumber: '01',
    topicCode: '1.2',
    question: 'Qual valor decimal sem sinal corresponde ao byte binário 00101010 e qual é sua representação hexadecimal?',
    options: [
      '42 em decimal e 2A em hexadecimal',
      '38 em decimal e 26 em hexadecimal',
      '44 em decimal e 2C em hexadecimal',
      '42 em decimal e 42 em hexadecimal'
    ],
    correctIndex: 0,
    explanation: '32 + 8 + 2 = 42. Dividindo em nibbles: 0010 (2) e 1010 (10 = A), logo 0x2A.'
  },
  {
    id: 'q-2',
    moduleNumber: '02',
    topicCode: '2.3',
    question: 'Qual será a saída exata do trecho em C abaixo?',
    codeSnippet: `int a = 7, b = 2;
int x = a / b;
int y = a++;
printf("%d %d %d", x, y, a);`,
    options: ['3 7 8', '3 8 8', '3.5 7 8', '3 7 7'],
    correctIndex: 0,
    explanation: 'a / b entre inteiros resulta em 3. Como a++ é pós-incremento, y recebe 7 e só depois a passa a valer 8.'
  },
  {
    id: 'q-3',
    moduleNumber: '03',
    topicCode: '3.3',
    question: 'Quantas vezes o corpo de um laço do { ... } while (0); é executado?',
    options: [
      'Nenhuma vez (0 vezes)',
      'Exatamente 1 vez',
      'Infinitas vezes',
      'Erro de compilação'
    ],
    correctIndex: 1,
    explanation: 'O laço do-while avalia a condição somente ao final do bloco, garantindo no mínimo 1 execução mesmo quando a condição é falsa (0).'
  },
  {
    id: 'q-4',
    moduleNumber: '03',
    topicCode: '3.4',
    question: 'Considere o código com break e continue. O que será impresso na tela?',
    codeSnippet: `for (int i = 1; i <= 5; i++) {
    if (i == 2) continue;
    if (i == 4) break;
    printf("%d", i);
}`,
    options: ['13', '123', '135', '1'],
    correctIndex: 0,
    explanation: 'Quando i==1 imprime 1; i==2 executa continue (pula printf); i==3 imprime 3; i==4 executa break e encerra o laço.'
  },
  {
    id: 'q-5',
    moduleNumber: '04',
    topicCode: '4.3',
    question: 'Qual será a saída após chamar a função contar() duas vezes consecutivas?',
    codeSnippet: `void contar(void) {
    static int s = 5;
    int n = 5;
    s++; n++;
    printf("%d-%d ", s, n);
}`,
    options: ['6-6 7-6', '6-6 7-7', '6-6 6-6', '5-5 6-5'],
    correctIndex: 0,
    explanation: 'A variável static s preserva seu valor entre chamadas (vai de 5 para 6, depois 7). Já a variável local n é recriada a cada chamada (sempre 6).'
  },
  {
    id: 'q-6',
    moduleNumber: '05',
    topicCode: '5.3',
    question: 'Qual é o tamanho mínimo do vetor char palavra[...] necessário para armazenar a string "LINGUAGEM" com segurança?',
    options: [
      '9 bytes',
      '10 bytes',
      '8 bytes',
      '11 bytes'
    ],
    correctIndex: 1,
    explanation: '"LINGUAGEM" tem 9 letras, mas toda string em C exige 1 byte adicional para o terminador nulo \'\\0\', totalizando 10 bytes.'
  },
  {
    id: 'q-7',
    moduleNumber: '05',
    topicCode: '5.2',
    question: 'Em uma matriz int mat[4][5] armazenada em Row-Major, qual o índice linear correspondente a mat[2][3]?',
    options: ['13', '11', '10', '8'],
    correctIndex: 0,
    explanation: 'O deslocamento Row-Major é (linha * total_colunas + coluna) = 2 * 5 + 3 = 13.'
  },
  {
    id: 'q-8',
    moduleNumber: '06',
    topicCode: '6.2',
    question: 'Analise o trecho com ponteiros. Quais os valores finais de x e y?',
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
    explanation: '*p = 30 altera x para 30. Depois p aponta para y (20), e *p = *p + x soma 20 + 30, gravando 50 em y.'
  },
  {
    id: 'q-9',
    moduleNumber: '06',
    topicCode: '6.3',
    question: 'Qual expressão equivale exatamente a acessar o terceiro elemento de um vetor v (ou seja, v[2]) usando aritmética de ponteiros?',
    options: ['*(v + 2)', '*v + 2', '&v + 2', '*(v + 8)'],
    correctIndex: 0,
    explanation: 'Em C, v[i] é açúcar sintático para *(v + i). Somar 2 ao ponteiro desloca 2 elementos e o * desreferencia o valor.'
  },
  {
    id: 'q-10',
    moduleNumber: '07',
    topicCode: '7.3',
    question: 'Qual modo de fopen() deve ser usado para acrescentar novas linhas ao final de um arquivo de texto existente sem apagar os dados anteriores?',
    options: ['"a"', '"w"', '"r"', '"wb"'],
    correctIndex: 0,
    explanation: 'O modo "a" (append) preserva o conteúdo existente e posiciona o cursor de escrita sempre ao final do arquivo.'
  }
];
