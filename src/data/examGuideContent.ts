export interface ExamTrap {
  number: number;
  title: string;
  wrongExample: string;
  rightExample: string;
  whyItMatters: string;
}

export interface TypeRefRow {
  typeName: string;
  approxSize: string;
  printfSpec: string;
  scanfSpec: string;
  notes: string;
}

export interface FileModeRow {
  mode: string;
  meaning: string;
  ifNotExists: string;
  ifExists: string;
}

export const DESK_CHECK_STEPS: Array<{ step: string; detail: string }> = [
  {
    step: '01. Monte a tabela de variáveis antes de ler o resto',
    detail:
      'Desenhe uma coluna para cada variável (ex: i, soma, *p) e uma coluna "Saída (stdout)". Anote lixo (?) para variáveis locais não inicializadas.',
  },
  {
    step: '02. Respeite os tipos e a divisão inteira',
    detail:
      'Sempre verifique o tipo de cada operando. Em C, int / int descarta a parte decimal (7 / 2 = 3). Só há casas decimais se ao menos um lado for float/double (7.0 / 2 = 3.5).',
  },
  {
    step: '03. Desenhe setas para ponteiros e índices de vetores',
    detail:
      'Para vetores, enumere caixas de 0 até N-1. Para ponteiros, anote o endereço simbólico (ex: &x) dentro da caixa de p e atualize o alvo sempre que houver *p = ...',
  },
  {
    step: '04. Trace laços e desvios linha a linha sem pular iterações',
    detail:
      'Em for(init; cond; passo), lembre-se da ordem: init (1 vez) -> testa cond -> executa corpo -> executa passo -> testa cond novamente. Se houver continue, ele pula direto para o passo!',
  },
];

export const TOP_EXAM_TRAPS: ExamTrap[] = [
  {
    number: 1,
    title: 'Confundir atribuição (=) com comparação (==)',
    wrongExample: 'if (x = 0) { /* nunca entra! */ }',
    rightExample: 'if (x == 0) { /* compara x com 0 */ }',
    whyItMatters:
      'Em C, x = 0 atribui 0 a x e avalia toda a expressão como 0 (falso). Já if (x = 5) avalia como 5 (verdadeiro) e altera x silenciosamente!',
  },
  {
    number: 2,
    title: 'Divisão inteira truncada e conversão implícita',
    wrongExample: 'double m = 5 / 2; // resulta 2.00!',
    rightExample: 'double m = 5.0 / 2; // ou (double)a / b -> 2.50',
    whyItMatters:
      'O cálculo 5 / 2 acontece antes da atribuição para double. Como ambos os operandos são int, o resultado já nasce 2 e só depois vira 2.0.',
  },
  {
    number: 3,
    title: 'Pré-incremento (++i) vs pós-incremento (i++) e *p++',
    wrongExample: 'int y = a++; // acha que y recebe a + 1',
    rightExample: 'int y = ++a; // ++a soma antes; a++ soma depois',
    whyItMatters:
      'a++ entrega o valor ANTIGO para a expressão e incrementa depois. Em *p++ = 99, a associatividade é da direita para esquerda: grava em *p atual e depois avança p.',
  },
  {
    number: 4,
    title: 'Literal com zero à esquerda (Octal) e tabela ASCII',
    wrongExample: 'int n = 010; // vale 8 em decimal!',
    rightExample: 'int n = 10; // decimal; 0x10 = 16 (hexa)',
    whyItMatters:
      'Números começando com 0 são interpretados em base octal (base 8). Além disso, char armazena código ASCII: \'A\' = 65, \'a\' = 97, \'0\' = 48.',
  },
  {
    number: 5,
    title: 'Esquecer o break no switch-case (Fall-Through)',
    wrongExample: 'case 1: x += 10; case 2: x += 20; break;',
    rightExample: 'case 1: x += 10; break; case 2: x += 20; break;',
    whyItMatters:
      'Sem break, ao entrar em case 1 o fluxo escorrega e executa também o case 2 até encontrar um break ou o fim do switch.',
  },
  {
    number: 6,
    title: 'Ponto e vírgula acidental após if / for / while',
    wrongExample: 'for (i = 0; i < 5; i++); printf("%d", i);',
    rightExample: 'for (i = 0; i < 5; i++) { printf("%d", i); }',
    whyItMatters:
      'O ";" logo após o parêntese cria um corpo vazio. O laço gira 5 vezes sem fazer nada e o printf executa uma única vez depois, imprimindo 5.',
  },
  {
    number: 7,
    title: 'Passagem por valor vs ponteiro e variável static',
    wrongExample: 'void dobrar(int x) { x *= 2; } // nao muda fora',
    rightExample: 'void dobrar(int *x) { *x *= 2; } // chamada: dobrar(&v)',
    whyItMatters:
      'C passa cópias por padrão. Para alterar a variável do chamador, passe o endereço (&v) e receba em ponteiro (*x). Variáveis locais static mantêm o valor entre chamadas.',
  },
  {
    number: 8,
    title: 'Strings sem terminador \\0, strlen vs sizeof e ==',
    wrongExample: 'if (s1 == "OK") // compara enderecos!',
    rightExample: 'if (strcmp(s1, "OK") == 0) // compara conteudo',
    whyItMatters:
      'strlen(s) conta apenas até o \'\\0\'; sizeof(s) devolve todos os bytes alocados do vetor. Sempre reserve +1 byte para o \'\\0\'.',
  },
  {
    number: 9,
    title: 'Armadilha do while (!feof(fp)) e modo "w" em arquivos',
    wrongExample: 'while (!feof(fp)) { fscanf(fp, "%d", &n); soma += n; }',
    rightExample: 'while (fscanf(fp, "%d", &n) == 1) { soma += n; }',
    whyItMatters:
      'feof() só retorna verdadeiro APÓS uma tentativa de leitura falhar no fim do arquivo, causando leitura repetida do último valor. E fopen(..., "w") apaga o arquivo existente!',
  },
  {
    number: 10,
    title: 'Esquecer & no scanf, buffer do teclado e free/fclose',
    wrongExample: 'scanf("%d", x); // falta & -> falha grave!',
    rightExample: 'scanf("%d", &x); // para string s nao usa &',
    whyItMatters:
      'Tipos primitivos (int, double, char) exigem & no scanf. Vetor char s[] já decai para endereço. Ao ler char após número, use " %c" com espaço antes do % para consumir o \\n.',
  },
];

export const TYPE_REF_ROWS: TypeRefRow[] = [
  {
    typeName: 'char',
    approxSize: '1 byte (8 bits)',
    printfSpec: '%c (caractere) / %d (ASCII)',
    scanfSpec: ' %c (com espaco) / %c',
    notes: 'Faixa -128 a 127 (ou 0 a 255 unsigned). Aspas simples: \'A\'.',
  },
  {
    typeName: 'int',
    approxSize: '4 bytes (32 bits)',
    printfSpec: '%d ou %i / %03d (zeros)',
    scanfSpec: '%d',
    notes: 'Aprox. -2,14 bilhoes a +2,14 bilhoes. Divisao inteira trunca.',
  },
  {
    typeName: 'long long',
    approxSize: '8 bytes (64 bits)',
    printfSpec: '%lld',
    scanfSpec: '%lld',
    notes: 'Ideal para fatoriais e somatorios grandes sem overflow.',
  },
  {
    typeName: 'float',
    approxSize: '4 bytes (6-7 digitos)',
    printfSpec: '%f ou %.2f',
    scanfSpec: '%f',
    notes: 'Precisao simples; sufixo f em literais (ex: 3.5f).',
  },
  {
    typeName: 'double',
    approxSize: '8 bytes (15 digitos)',
    printfSpec: '%f ou %.2f',
    scanfSpec: '%lf (obrigatorio!)',
    notes: 'Padrao em provas para medias e calculos; scanf EXIGE %lf.',
  },
  {
    typeName: 'char[] (string)',
    approxSize: 'N bytes (inclui \\0)',
    printfSpec: '%s',
    scanfSpec: '%s (sem &; para no espaco)',
    notes: 'Use fgets(s, N, stdin) para ler frases com espacos.',
  },
  {
    typeName: 'size_t / ponteiro',
    approxSize: '4 ou 8 bytes',
    printfSpec: '%zu (size_t) / %p (endereco)',
    scanfSpec: '-',
    notes: 'strlen() e sizeof() retornam size_t. Ponteiro nulo = NULL.',
  },
];

export const OPERATOR_PRECEDENCE: Array<{ level: string; operators: string; associativity: string }> = [
  { level: '1 (Mais alta)', operators: '()  []  ->  .  pós-fixo (x++  x--)', associativity: 'Esquerda -> Direita' },
  { level: '2 (Unarios)', operators: 'pré-fixo (++x  --x)  * (deref)  & (end)  !  ~  +  -  (cast)  sizeof', associativity: 'Direita -> Esquerda' },
  { level: '3 (Multiplicativos)', operators: '*   /   %', associativity: 'Esquerda -> Direita' },
  { level: '4 (Aditivos)', operators: '+   -', associativity: 'Esquerda -> Direita' },
  { level: '5 (Relacionais)', operators: '<   <=   >   >=', associativity: 'Esquerda -> Direita' },
  { level: '6 (Igualdade)', operators: '==   !=', associativity: 'Esquerda -> Direita' },
  { level: '7 (Logico E / OU)', operators: '&& (avaliado antes de ||)   ||', associativity: 'Esquerda -> Direita' },
  { level: '8 (Ternario)', operators: 'cond ? expr1 : expr2', associativity: 'Direita -> Esquerda' },
  { level: '9 (Mais baixa)', operators: '=   +=   -=   *=   /=   %=', associativity: 'Direita -> Esquerda' },
];

export const FILE_MODE_ROWS: FileModeRow[] = [
  { mode: '"r"', meaning: 'Leitura (texto)', ifNotExists: 'Retorna NULL', ifExists: 'Abre no inicio' },
  { mode: '"w"', meaning: 'Escrita (texto)', ifNotExists: 'Cria arquivo novo', ifExists: 'APAGA todo conteudo!' },
  { mode: '"a"', meaning: 'Acrescimo / append', ifNotExists: 'Cria arquivo novo', ifExists: 'Escreve no final' },
  { mode: '"r+"', meaning: 'Leitura e escrita', ifNotExists: 'Retorna NULL', ifExists: 'Mantem e edita do inicio' },
  { mode: '"rb" / "wb"', meaning: 'Leitura / escrita binaria', ifNotExists: 'NULL (rb) / Cria (wb)', ifExists: 'Igual r / w sem traducao \\n' },
];

export const PRE_EXAM_CHECKLIST: string[] = [
  'Toda instrucao termina com ";" e blocos { } estao balanceados (sem ";" logo apos if/for/while)?',
  'Todas as variaveis locais (especialmente somadores e contadores como soma = 0, cont = 0) foram inicializadas?',
  'No scanf, variaveis primitivas usam "&" (ex: scanf("%d", &n)) e double usa "%lf"?',
  'Em divisoes que precisam de decimais, ao menos um operando e float/double ou tem cast (double)?',
  'No switch-case, todos os casos independentes terminam com break;?',
  'Em vetores e matrizes de tamanho N, os indices usados vao apenas de 0 ate N - 1?',
  'Em strings, ha espaco para o terminador \'\\0\' e as comparacoes usam strcmp(a, b) == 0 em vez de ==?',
  'Ponteiros retornados por malloc() foram testados contra NULL e liberados com free(); arquivos verificados e fechados com fclose()?',
];
