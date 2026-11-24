export type LabId =
  | 'von-neumann'
  | 'binary-converter'
  | 'logic-gates'
  | 'variables-memory'
  | 'algorithm-properties'
  | 'flowchart-pseudocode'
  | 'c-anatomy'
  | 'sizeof-types'
  | 'operators-precedence'
  | 'printf-scanf'
  | 'sequential-trace'
  | 'selection-branch'
  | 'loop-engine'
  | 'flow-control'
  | 'call-stack'
  | 'value-vs-ref'
  | 'scope-lifetime'
  | 'custom-libs'
  | 'array-1d'
  | 'matrix-2d'
  | 'c-strings'
  | 'memory-addresses'
  | 'pointer-sandbox'
  | 'pointer-arrays-heap'
  | 'file-types'
  | 'file-pointer-cursor'
  | 'fopen-modes'
  | 'file-io-bench';

export interface Topic {
  id: string;
  code: string;
  title: string;
  summary: string;
  keyPoints: string[];
  codeTitle: string;
  codeExample: string;
  pitfall: string;
  labId: LabId;
  labTitle: string;
  labSubtitle: string;
}

export interface Module {
  id: string;
  number: string;
  title: string;
  description: string;
  topics: Topic[];
}

export const CURRICULUM: Module[] = [
  {
    id: 'mod-1',
    number: '01',
    title: 'Fundamentos de computação e algoritmos',
    description:
      'Como o computador executa instruções, representa dados em bits e estrutura a lógica antes mesmo da primeira linha em C.',
    topics: [
      {
        id: '1.1',
        code: '1.1',
        title: 'Princípios básicos de funcionamento e organização de computadores',
        summary:
          'Na arquitetura de Von Neumann, programas e dados compartilham a mesma memória RAM. A CPU busca instruções, decodifica na Unidade de Controle (UC) e executa cálculos na ULA usando registradores ultrarrápidos.',
        keyPoints: [
          'CPU divide-se em UC (coordena fluxo), ULA (cálculos lógicos e aritméticos) e Registradores.',
          'Memória Principal (RAM) é volátil e endereçável por byte; Armazenamento secundário (SSD/HD) é persistente.',
          'Barramentos de Dados, Endereços e Controle interligam CPU, memória e dispositivos de Entrada/Saída.',
          'O ciclo Fetch-Decode-Execute repete-se bilhões de vezes por segundo conforme o clock.'
        ],
        codeTitle: 'Como C conversa com o hardware',
        codeExample: `#include <stdio.h>

int main(void) {
    int a = 5;          // Armazenado na RAM (ex: 0x1004)
    int b = 3;          // Armazenado na RAM (ex: 0x1008)
    int soma = a + b;   // CPU carrega para registradores, ULA soma
    printf("%d\\n", soma); // Enviado ao dispositivo de saída (tela)
    return 0;
}`,
        pitfall:
          'Confundir RAM com disco: variáveis em C vivem na RAM e desaparecem ao encerrar o programa, a menos que você grave em arquivo.',
        labId: 'von-neumann',
        labTitle: 'Simulador do Ciclo Fetch-Decode-Execute',
        labSubtitle: 'Avance passo a passo para ver dados circulando entre RAM, UC, Registradores e ULA.'
      },
      {
        id: '1.2',
        code: '1.2',
        title: 'Sistemas de numeração e representação de informações',
        summary:
          'Computadores operam com dois estados elétricos (0 e 1, bits). Agrupamentos de 8 bits formam 1 byte, capaz de representar números sem sinal (0–255), números com sinal em Complemento de 2 (-128 a +127) ou caracteres ASCII.',
        keyPoints: [
          'Binário (base 2), Octal (base 8, grupos de 3 bits) e Hexadecimal (base 16, grupos de 4 bits: 0-9, A-F).',
          'Hexadecimal é amplamente usado em C para endereços de memória (0x7fff...) e máscaras de bits.',
          'Inteiros negativos usam Complemento de 2: inverta todos os bits e some 1.',
          'Cada caractere char em C guarda na prática um código numérico inteiro da tabela ASCII (ex: \'A\' = 65).'
        ],
        codeTitle: 'Bases numéricas e ASCII em C',
        codeExample: `#include <stdio.h>

int main(void) {
    int dec = 65;
    int hex = 0x41;     // Prefixo 0x indica hexadecimal
    int oct = 0101;     // Prefixo 0 indica octal
    char letra = 65;    // 'A' na tabela ASCII

    printf("Dec: %d | Hex: %X | Char: %c\\n", dec, hex, letra);
    return 0;
}`,
        pitfall:
          'Escrever 010 pensando que é dez: em C, um zero à esquerda (010) declara um número em base OCTAL (que vale 8 em decimal!).',
        labId: 'binary-converter',
        labTitle: 'Laboratório Interativo de Bits e Bases',
        labSubtitle: 'Clique nos 8 bits para alternar 0 e 1 e observar Decimal, Sinalizado, Octal, Hex e ASCII.'
      },
      {
        id: '1.3',
        code: '1.3',
        title: 'Lógica de programação',
        summary:
          'A lógica proposicional fundamenta toda tomada de decisão. Em C, não havia tipo bool nativo no C89: qualquer valor 0 é falso, e qualquer valor diferente de zero é verdadeiro.',
        keyPoints: [
          'Conjunção (E / &&): verdadeira apenas quando todas as condições são verdadeiras.',
          'Disjunção (OU / ||): verdadeira se pelo menos uma condição for verdadeira.',
          'Negação (NÃO / !): inverte o valor lógico; Leis de De Morgan permitem simplificar expressões.',
          'Avaliação em curto-circuito: em A && B, se A é falso, C nem avalia B.'
        ],
        codeTitle: 'Tabela-verdade aplicada em C',
        codeExample: `#include <stdio.h>

int main(void) {
    int idade = 20;
    int temCarteira = 1; // 1 = verdadeiro, 0 = falso

    if (idade >= 18 && temCarteira) {
        printf("Pode dirigir\\n");
    }
    return 0;
}`,
        pitfall:
          'Confundir & (AND bit a bit) com && (AND lógico), ou escrever 10 < x < 20 (em C isso compara (10 < x) < 20, sempre verdadeiro!).',
        labId: 'logic-gates',
        labTitle: 'Simulador de Portas Lógicas e Tabela-Verdade',
        labSubtitle: 'Alterne entradas A e B e o operador para visualizar o sinal de saída e a linha ativa.'
      },
      {
        id: '1.4',
        code: '1.4',
        title: 'Tipos de dados, variáveis, constantes, comandos e expressões',
        summary:
          'Uma variável associa um nome simbólico a um espaço tipado na memória cujo conteúdo pode mudar durante a execução. Constantes protegem valores fixos contra alterações acidentais.',
        keyPoints: [
          'Identificadores válidos começam com letra ou _ (underscore) e são sensíveis a maiúsculas/minúsculas.',
          'Tipagem estática e forte na declaração: o tipo define quanto espaço reservar e quais operações são válidas.',
          'Expressões combinam operandos e operadores para produzir um valor; comandos terminam com ponto e vírgula (;).',
          'Constantes evitam "números mágicos" e tornam o código seguro e legível.'
        ],
        codeTitle: 'Variáveis vs Constantes',
        codeExample: `#include <stdio.h>
#define TAXA_MAX 0.15

int main(void) {
    const int DIAS_SEMANA = 7;
    int horas = 8;
    double bonus = horas * TAXA_MAX;

    horas = 10; // Válido: variável pode mudar
    // DIAS_SEMANA = 8; -> Erro de compilação!
    printf("Bonus: %.2f\\n", bonus);
    return 0;
}`,
        pitfall:
          'Usar variável antes de inicializá-la: em C, variáveis locais não recebem zero automaticamente — contêm "lixo de memória".',
        labId: 'variables-memory',
        labTitle: 'Inspetor de Caixas de Memória e Expressões',
        labSubtitle: 'Altere valores e teste tentar sobrescrever uma constante para ver a proteção em ação.'
      },
      {
        id: '1.5',
        code: '1.5',
        title: 'Definição e propriedades de algoritmos',
        summary:
          'Um algoritmo é uma sequência finita, ordenada e não ambígua de passos executáveis que transforma entradas em saídas esperadas para resolver um problema.',
        keyPoints: [
          'Finitude: deve terminar após um número finito de passos (sem laços infinitos).',
          'Clareza / Definição precisa: cada instrução não pode dar margem a dupla interpretação.',
          'Entrada (0 ou mais dados fornecidos) e Saída (pelo menos 1 resultado produzido).',
          'Efetividade: cada passo deve ser básico o bastante para ser executado em tempo finito.'
        ],
        codeTitle: 'Exemplo de algoritmo finito vs laço infinito',
        codeExample: `// Algoritmo correto: reduz o problema até terminar
int fatorial(int n) {
    int res = 1;
    while (n > 1) {
        res *= n;
        n--; // Garante a finitude!
    }
    return res;
}`,
        pitfall:
          'Esquecer de atualizar a variável de controle dentro de um while viola a propriedade de finitude e trava o programa.',
        labId: 'algorithm-properties',
        labTitle: 'Verificador de Propriedades Algorítmicas',
        labSubtitle: 'Compare algoritmos válidos e inválidos (laço infinito, ambiguidade) passo a passo.'
      },
      {
        id: '1.6',
        code: '1.6',
        title: 'Representação de algoritmos por meio de pseudocódigo e fluxogramas',
        summary:
          'Antes de codificar em C, algoritmos são planejados usando pseudocódigo (Portugol/linguagem estruturada) ou fluxogramas gráficos com símbolos padronizados.',
        keyPoints: [
          'Terminal (oval/cápsula): marca Início e Fim do fluxo.',
          'Entrada/Saída (paralelogramo): leitura de dados e exibição de resultados.',
          'Processamento (retângulo): atribuições e cálculos matemáticos.',
          'Decisão (losango): desvio condicional com caminhos Verdadeiro e Falso.'
        ],
        codeTitle: 'Do Pseudocódigo para C',
        codeExample: `/* Pseudocódigo:
   Leia nota
   Se nota >= 6.0 entao Escreva "Aprovado"
   Senao Escreva "Reprovado" */

#include <stdio.h>
int main(void) {
    float nota = 7.5f;
    if (nota >= 6.0f) printf("Aprovado\\n");
    else printf("Reprovado\\n");
    return 0;
}`,
        pitfall:
          'Fluxogramas sem seta de retorno clara ou com losango tendo apenas uma saída geram lógica incompleta ao traduzir para C.',
        labId: 'flowchart-pseudocode',
        labTitle: 'Fluxograma Sincronizado com Pseudocódigo',
        labSubtitle: 'Altere a nota de entrada e avance o fluxo para ver o bloco do fluxograma e o pseudocódigo sincronizados.'
      }
    ]
  },
  {
    id: 'mod-2',
    number: '02',
    title: 'Introdução à linguagem C',
    description:
      'Anatomia de um arquivo .c, sistema de tipos nativos, precedência de operadores e comunicação via printf e scanf.',
    topics: [
      {
        id: '2.1',
        code: '2.1',
        title: 'Estrutura básica de um programa em C',
        summary:
          'Todo programa C executável inicia pela função main(). Diretivas #include importam protótipos da biblioteca padrão (como stdio.h) antes da compilação gerar código de máquina.',
        keyPoints: [
          'Pré-processamento (#include, #define) expande cabeçalhos e macros no código fonte.',
          'int main(void) é o ponto de entrada oficial; return 0 indica ao sistema operacional que tudo correu bem.',
          'Blocos são delimitados por chaves { } e comentários usam // ou /* ... */.',
          'Pipeline de compilação: Pré-processador -> Compilador (Assembly) -> Montador (Objeto .o) -> Linker (Executável).'
        ],
        codeTitle: 'Programa mínimo completo em C',
        codeExample: `#include <stdio.h> // Diretiva de pré-processamento

int main(void) {   // Ponto de entrada
    printf("Ola, Linguagem C!\\n");
    return 0;      // Código de saída para o SO
}`,
        pitfall:
          'Esquecer ponto e vírgula (;) ao final de instruções ou omitir #include <stdio.h> ao usar printf/scanf.',
        labId: 'c-anatomy',
        labTitle: 'Raio-X da Anatomia e Compilação em C',
        labSubtitle: 'Inspecione cada parte do código e percorra os 4 estágios do compilador GCC.'
      },
      {
        id: '2.2',
        code: '2.2',
        title: 'Tipos de dados, declaração de variáveis e constantes',
        summary:
          'C oferece tipos primitivos enxutos próximos ao hardware: char (1 byte), int (geralmente 4 bytes), float (4 bytes, precisão simples) e double (8 bytes, precisão dupla), além de modificadores signed, unsigned, short e long.',
        keyPoints: [
          'Use sizeof(tipo) para descobrir quantos bytes um tipo ocupa na sua arquitetura.',
          'char armazena 1 byte (-128 a 127 ou 0 a 255 se unsigned).',
          'float tem ~6-7 dígitos decimais de precisão; double tem ~15 dígitos.',
          'const garante verificação pelo compilador; #define faz substituição textual no pré-processador.'
        ],
        codeTitle: 'Inspecionando tamanhos com sizeof',
        codeExample: `#include <stdio.h>

int main(void) {
    char c = 'Z';
    int idade = 21;
    float altura = 1.75f;
    double pi = 3.14159265358979;

    printf("char: %zu byte | int: %zu bytes\\n", sizeof(c), sizeof(idade));
    printf("float: %zu bytes | double: %zu bytes\\n", sizeof(altura), sizeof(pi));
    return 0;
}`,
        pitfall:
          'Estouro de inteiro (overflow): tentar guardar 300 em um unsigned char (máx. 255) ou 3 bilhões em um int de 32 bits gera valores inesperados.',
        labId: 'sizeof-types',
        labTitle: 'Mapa Visual de Memória e sizeof()',
        labSubtitle: 'Selecione tipos e modificadores para visualizar bytes alocados e limites mínimos/máximos.'
      },
      {
        id: '2.3',
        code: '2.3',
        title: 'Operadores e expressões',
        summary:
          'Além dos operadores aritméticos (+, -, *, /, %), C possui divisão inteira quando ambos operandos são int, operadores relacionais, lógicos e incremento pré-fixado (++i) ou pós-fixado (i++).',
        keyPoints: [
          'Divisão entre dois inteiros descarta a parte decimal: 5 / 2 resulta em 2 (use 5.0 / 2 ou cast (float)5 / 2).',
          'Operador módulo (%) retorna o resto da divisão inteira (só funciona com inteiros!).',
          'Pré-incremento (++i): incrementa primeiro, depois retorna o novo valor.',
          'Pós-incremento (i++): usa o valor atual na expressão e incrementa depois.'
        ],
        codeTitle: 'Divisão inteira e ++i vs i++',
        codeExample: `#include <stdio.h>

int main(void) {
    int a = 5, b = 2;
    printf("5 / 2 = %d | Resto = %d\\n", a / b, a % b);
    printf("Com cast = %.1f\\n", (float)a / b);

    int x = 10;
    int y = x++; // y recebe 10, depois x vira 11
    int z = ++x; // x vira 12, depois z recebe 12
    printf("x=%d, y=%d, z=%d\\n", x, y, z);
    return 0;
}`,
        pitfall:
          'Escrever if (x = 5) em vez de if (x == 5): = é atribuição e retorna 5 (verdadeiro!), sobrescrevendo x silenciosamente.',
        labId: 'operators-precedence',
        labTitle: 'Laboratório ++i vs i++ e Divisão Inteira',
        labSubtitle: 'Teste expressões passo a passo e veja exatamente quando a variável é incrementada.'
      },
      {
        id: '2.4',
        code: '2.4',
        title: 'Operações de entrada e saída',
        summary:
          'printf formata e imprime dados na saída padrão (stdout) usando especificadores (%d, %f, %c, %s). scanf lê dados da entrada padrão (stdin) e exige o endereço de memória (&) da variável.',
        keyPoints: [
          '%d ou %i (int), %f (float), %lf (double no scanf), %c (char), %s (string).',
          'Modificadores de formato: %.2f limita a 2 casas decimais; %05d preenche com zeros.',
          'scanf("%d", &num) precisa do & para saber onde gravar o valor digitado.',
          'Ao ler %c após números, use espaço antes: scanf(" %c", &ch) para ignorar o \\n pendente no buffer.'
        ],
        codeTitle: 'Entrada e saída formatada',
        codeExample: `#include <stdio.h>

int main(void) {
    int codigo;
    float preco;
    printf("Digite codigo e preco: ");
    scanf("%d %f", &codigo, &preco);
    printf("Item #%04d custa R$ %.2f\\n", codigo, preco);
    return 0;
}`,
        pitfall:
          'Esquecer o & no scanf("%d", x) causa comportamento indefinido / falha de segmentação, pois scanf interpreta o valor de x como endereço!',
        labId: 'printf-scanf',
        labTitle: 'Simulador Interativo printf & scanf',
        labSubtitle: 'Escolha especificadores de formato e digite valores para ver a saída exata do terminal.'
      }
    ]
  },
  {
    id: 'mod-3',
    number: '03',
    title: 'Estruturas de controle',
    description:
      'Como guiar a ordem de execução das instruções por meio de sequências, decisões condicionais, laços e desvios.',
    topics: [
      {
        id: '3.1',
        code: '3.1',
        title: 'Estrutura sequencial',
        summary:
          'É o fluxo padrão de cima para baixo: cada instrução é executada exatamente uma vez, na ordem em que aparece dentro da função, atualizando o estado da memória passo a passo.',
        keyPoints: [
          'A ordem das linhas importa: ler ou calcular antes de declarar/atribuir gera resultados incorretos.',
          'Trocar valores entre duas variáveis (swap) exige uma variável auxiliar temporária.',
          'Tabelas de rastreio (teste de mesa) acompanham o valor de cada variável linha por linha.'
        ],
        codeTitle: 'Troca de valores (Swap sequencial)',
        codeExample: `#include <stdio.h>

int main(void) {
    int a = 10, b = 20, temp;
    temp = a; // temp = 10
    a = b;    // a = 20
    b = temp; // b = 10
    printf("a=%d, b=%d\\n", a, b);
    return 0;
}`,
        pitfall:
          'Fazer a = b; b = a; sem variável auxiliar: ambos terminam com o valor original de b e o valor de a é perdido.',
        labId: 'sequential-trace',
        labTitle: 'Teste de Mesa Sequencial (Swap)',
        labSubtitle: 'Execute linha por linha para acompanhar temp, a e b na tabela de rastreio.'
      },
      {
        id: '3.2',
        code: '3.2',
        title: 'Estruturas de seleção',
        summary:
          'Permitem escolher qual bloco de código executar com base em condições booleanas (if, else if, else), múltiplos casos inteiros constantes (switch-case) ou o operador ternário (?:).',
        keyPoints: [
          'if / else if / else avaliam condições em cascata; apenas o primeiro ramo verdadeiro executa.',
          'switch-case testa igualdade contra constantes inteiras ou char; exige break ao final de cada case.',
          'Operador ternário: condicao ? valor_se_verdadeiro : valor_se_falso.'
        ],
        codeTitle: 'Classificação com if-else e switch',
        codeExample: `#include <stdio.h>

int main(void) {
    float nota = 8.2f;
    if (nota >= 9.0f) {
        printf("Conceito A\\n");
    } else if (nota >= 7.0f) {
        printf("Conceito B\\n");
    } else if (nota >= 5.0f) {
        printf("Conceito C\\n");
    } else {
        printf("Reprovado\\n");
    }
    return 0;
}`,
        pitfall:
          'Esquecer o break dentro de um switch provoca "fall-through", executando todos os cases seguintes até encontrar um break.',
        labId: 'selection-branch',
        labTitle: 'Árvore de Decisão if / else if / else',
        labSubtitle: 'Arraste o controle de nota para ver qual ramo condicional é avaliado e ativado.'
      },
      {
        id: '3.3',
        code: '3.3',
        title: 'Estruturas de repetição',
        summary:
          'Laços executam um bloco repetidamente enquanto uma condição for verdadeira. for é ideal para contagens conhecidas; while testa antes de entrar; do-while garante ao menos uma execução.',
        keyPoints: [
          'for (inicialização; condição; incremento): concentra o controle em uma linha.',
          'while (condição): pré-teste — se a condição já for falsa no início, executa 0 vezes.',
          'do { ... } while (condição);: pós-teste — útil para menus e validação de entrada (executa >= 1 vez).'
        ],
        codeTitle: 'Comparando for, while e do-while',
        codeExample: `#include <stdio.h>

int main(void) {
    int soma = 0;
    for (int i = 1; i <= 5; i++) {
        soma += i;
    }
    printf("Soma = %d\\n", soma); // 15
    return 0;
}`,
        pitfall:
          'Colocar ponto e vírgula logo após o cabeçalho: while (i < 10); cria um laço vazio que trava o programa se i não mudar dentro dele.',
        labId: 'loop-engine',
        labTitle: 'Motor Visual de Repetição',
        labSubtitle: 'Alterne entre for, while e do-while, defina o limite (até 0!) e observe cada iteração.'
      },
      {
        id: '3.4',
        code: '3.4',
        title: 'Controle do fluxo de execução',
        summary:
          'Comandos de salto estruturados alteram a iteração atual ou encerram blocos imediatamente: break interrompe o laço mais interno; continue pula o restante da iteração atual; return encerra a função.',
        keyPoints: [
          'break sai imediatamente do for, while, do-while ou switch atual.',
          'continue pula para a próxima verificação de condição (no for, ainda executa o incremento!).',
          'return antecipado (guard clause) simplifica funções evitando vários níveis de if aninhados.'
        ],
        codeTitle: 'break vs continue em ação',
        codeExample: `#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 5; i++) {
        if (i == 3) continue; // Pula o 3
        if (i == 5) break;    // Para no 5
        printf("%d ", i);     // Imprime: 1 2 4
    }
    return 0;
}`,
        pitfall:
          'Em um laço while, usar continue antes da linha que incrementa o contador (i++) gera um laço infinito!',
        labId: 'flow-control',
        labTitle: 'Simulador break vs continue',
        labSubtitle: 'Ative break ou continue na iteração i == 3 e acompanhe a tabela de execução.'
      }
    ]
  },
  {
    id: 'mod-4',
    number: '04',
    title: 'Modularização',
    description:
      'Dividir sistemas grandes em funções coesas, entender a pilha de chamadas, escopo de variáveis e arquivos .h/.c.',
    topics: [
      {
        id: '4.1',
        code: '4.1',
        title: 'Funções e procedimentos',
        summary:
          'Funções retornam um valor tipado (ex: int, double), enquanto procedimentos têm tipo de retorno void. Cada chamada cria um novo quadro (stack frame) na pilha de execução (Call Stack).',
        keyPoints: [
          'Protótipos (assinaturas antes do main) permitem organizar funções abaixo do main().',
          'Cada chamada empilha parâmetros, endereço de retorno e variáveis locais na Call Stack.',
          'Recursão ocorre quando uma função chama a si mesma, exigindo um caso base de parada.'
        ],
        codeTitle: 'Função recursiva e Call Stack',
        codeExample: `#include <stdio.h>

int fatorial(int n); // Protótipo

int main(void) {
    printf("3! = %d\\n", fatorial(3));
    return 0;
}

int fatorial(int n) {
    if (n <= 1) return 1; // Caso base
    return n * fatorial(n - 1);
}`,
        pitfall:
          'Recursão sem caso base ou sem convergência estoura a pilha de memória (Stack Overflow).',
        labId: 'call-stack',
        labTitle: 'Visualizador de Pilha de Chamadas (Call Stack)',
        labSubtitle: 'Acompanhe os quadros sendo empilhados e desempilhados durante fatorial(n).'
      },
      {
        id: '4.2',
        code: '4.2',
        title: 'Parâmetros e valores de retorno',
        summary:
          'Por padrão, C passa argumentos POR VALOR: a função recebe uma cópia independente. Para modificar a variável original do chamador, passamos seu endereço (simulando passagem por referência com ponteiros).',
        keyPoints: [
          'Passagem por valor protege o dado original contra efeitos colaterais indesejados.',
          'Passagem por referência (via ponteiros *param e &arg) permite alterar múltiplas variáveis ou evitar cópias grandes.',
          'return envia um único valor de volta e encerra a execução da função imediatamente.'
        ],
        codeTitle: 'Por valor vs Por referência',
        codeExample: `#include <stdio.h>

void dobrarValor(int x) { x *= 2; }      // Altera só a cópia
void dobrarRef(int *x)  { *x *= 2; }     // Altera a original

int main(void) {
    int n = 10;
    dobrarValor(n); // n continua 10
    dobrarRef(&n);  // n agora vale 20
    printf("n = %d\\n", n);
    return 0;
}`,
        pitfall:
          'Tentar alterar uma variável do main usando passagem por valor e estranhar que o valor continuou igual após a chamada.',
        labId: 'value-vs-ref',
        labTitle: 'Comparador: Passagem por Valor vs Referência',
        labSubtitle: 'Dispare as duas versões da função e veja quais quadros da RAM são alterados.'
      },
      {
        id: '4.3',
        code: '4.3',
        title: 'Escopo e tempo de vida de variáveis',
        summary:
          'Escopo define onde um identificador é visível (bloco, função ou arquivo). Tempo de vida (duração de armazenamento) define por quanto tempo a memória permanece reservada.',
        keyPoints: [
          'Locais (auto): nascem ao entrar no bloco { } e morrem ao sair dele.',
          'Globais: declaradas fora de funções; visíveis em todo o arquivo e vivem até o fim do programa.',
          'static local: visível apenas dentro da função, mas preserva seu valor entre chamadas sucessivas!'
        ],
        codeTitle: 'Variável local vs static',
        codeExample: `#include <stdio.h>

void contar(void) {
    int normal = 0;         // Reinicia a cada chamada
    static int fixa = 0;    // Mantém valor entre chamadas
    normal++;
    fixa++;
    printf("normal=%d | static=%d\\n", normal, fixa);
}

int main(void) {
    contar(); contar(); contar();
    return 0;
}`,
        pitfall:
          'Abusar de variáveis globais cria acoplamento oculto e bugs difíceis de rastrear; prefira parâmetros e retornos explícitos.',
        labId: 'scope-lifetime',
        labTitle: 'Simulador de Escopo e Duração (auto vs static)',
        labSubtitle: 'Chame a função repetidas vezes e observe como a variável static sobrevive ao retorno.'
      },
      {
        id: '4.4',
        code: '4.4',
        title: 'Programação e utilização de bibliotecas próprias',
        summary:
          'Projetos reais separam interface de implementação: arquivos de cabeçalho (.h) declaram protótipos com include guards (#ifndef), enquanto arquivos (.c) implementam as funções e são compilados juntos.',
        keyPoints: [
          'Use aspas duplas (#include "matematica.h") para cabeçalhos locais e <> para bibliotecas padrão.',
          'Include guards (#ifndef ... #define ... #endif) evitam inclusão dupla em projetos com múltiplos arquivos.',
          'Compilação modular: gcc main.c matematica.c -o programa.'
        ],
        codeTitle: 'Estrutura de biblioteca própria',
        codeExample: `/* matematica.h */
#ifndef MATEMATICA_H
#define MATEMATICA_H
int quadrado(int x);
#endif

/* matematica.c */
#include "matematica.h"
int quadrado(int x) { return x * x; }

/* main.c */
#include <stdio.h>
#include "matematica.h"
int main(void) { printf("%d\\n", quadrado(6)); return 0; }`,
        pitfall:
          'Colocar implementações de funções direto no .h sem static/inline causa erro de "multiple definition" ao ligar vários arquivos .c.',
        labId: 'custom-libs',
        labTitle: 'Inspetor de Biblioteca Modular (.h + .c)',
        labSubtitle: 'Explore a conexão entre cabeçalho, implementação, include guards e linkedição.'
      }
    ]
  },
  {
    id: 'mod-5',
    number: '05',
    title: 'Estruturas de dados homogêneas',
    description:
      'Armazenamento contíguo de coleções do mesmo tipo: vetores unidimensionais, matrizes bidimensionais e strings em C.',
    topics: [
      {
        id: '5.1',
        code: '5.1',
        title: 'Vetores',
        summary:
          'Um vetor (array 1D) reserva um bloco contínuo na memória para N elementos do mesmo tipo. Índices sempre começam em 0 e vão até N - 1.',
        keyPoints: [
          'Acesso O(1) instantâneo: endereço de v[i] = endereço_base + i * sizeof(tipo).',
          'C não verifica limites automaticamente: acessar v[N] lê ou corrompe memória vizinha!',
          'Ao passar um vetor para uma função, passa-se o endereço do primeiro elemento (e o tamanho em outro parâmetro).'
        ],
        codeTitle: 'Percorrendo e somando um vetor',
        codeExample: `#include <stdio.h>

int main(void) {
    int notas[4] = {8, 7, 10, 9};
    int soma = 0;
    for (int i = 0; i < 4; i++) {
        soma += notas[i];
    }
    printf("Media = %.2f\\n", soma / 4.0);
    return 0;
}`,
        pitfall:
          'Acessar índice N em um vetor de tamanho N (erro off-by-one: i <= N em vez de i < N) invade memória não pertencente ao vetor.',
        labId: 'array-1d',
        labTitle: 'Laboratório de Vetores Contíguos na RAM',
        labSubtitle: 'Edite índices, veja endereços consecutivos (+4 bytes) e execute busca linear animada.'
      },
      {
        id: '5.2',
        code: '5.2',
        title: 'Matrizes',
        summary:
          'Matrizes (arrays 2D) organizam dados em linhas e colunas: tipo m[L][C]. Na memória RAM física, que é linear, C armazena linha após linha (ordem Row-Major).',
        keyPoints: [
          'Primeiro índice indica a linha; segundo índice indica a coluna.',
          'Percorrer com dois laços for aninhados: externo percorre linhas, interno percorre colunas.',
          'Deslocamento linear na RAM: índice = linha * NUM_COLUNAS + coluna.'
        ],
        codeTitle: 'Matriz 3x3 e diagonal principal',
        codeExample: `#include <stdio.h>

int main(void) {
    int m[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", m[i][j]);
        }
        printf("\\n");
    }
    return 0;
}`,
        pitfall:
          'Ao passar uma matriz para função em C, o número de colunas é obrigatório no parâmetro (ex: void f(int m[][3], int linhas)).',
        labId: 'matrix-2d',
        labTitle: 'Explorador de Matriz 2D e Mapeamento Row-Major',
        labSubtitle: 'Clique em qualquer célula m[i][j] para destacar sua posição exata na memória linear.'
      },
      {
        id: '5.3',
        code: '5.3',
        title: 'Strings',
        summary:
          'Em C, não existe um tipo primitivo "string": strings são vetores de char encerrados obrigatoriamente pelo caractere nulo \'\\0\' (valor ASCII 0).',
        keyPoints: [
          'Um char nome[10] comporta no máximo 9 caracteres úteis + 1 byte para o \'\\0\'.',
          'Biblioteca <string.h>: strlen (comprimento sem \\0), strcpy (cópia), strcmp (comparação == 0), strcat.',
          'Prefira fgets(buf, sizeof(buf), stdin) em vez do perigoso gets() para evitar buffer overflow.'
        ],
        codeTitle: 'Manipulação segura de strings',
        codeExample: `#include <stdio.h>
#include <string.h>

int main(void) {
    char curso[12] = "Linguagem";
    printf("Texto: %s\\n", curso);
    printf("strlen: %zu | sizeof: %zu\\n", strlen(curso), sizeof(curso));
    if (strcmp(curso, "Linguagem") == 0) {
        printf("Strings identicas!\\n");
    }
    return 0;
}`,
        pitfall:
          'Comparar strings com s1 == s2 compara os ENDEREÇOS de memória dos vetores, não o texto! Sempre use strcmp(s1, s2) == 0.',
        labId: 'c-strings',
        labTitle: 'Inspetor de Strings e Terminador \\0',
        labSubtitle: 'Digite um texto para ver cada byte ASCII, a posição do \\0 e a diferença entre strlen e sizeof.'
      }
    ]
  },
  {
    id: 'mod-6',
    number: '06',
    title: 'Ponteiros',
    description:
      'O superpoder da linguagem C: endereços de memória, indireção (*p), relação com vetores e alocação dinâmica.',
    topics: [
      {
        id: '6.1',
        code: '6.1',
        title: 'Conceito de endereço de memória',
        summary:
          'Cada byte da memória RAM possui um endereço numérico único (geralmente exibido em hexadecimal). O operador unário & ("endereço de") obtém onde uma variável mora.',
        keyPoints: [
          'Operador & retorna o endereço inicial de uma variável na RAM.',
          'Em printf, imprima endereços convertidos para (void*) com o especificador %p.',
          'Variáveis de 4 bytes (como int) ocupam 4 endereços consecutivos; seu endereço é o do primeiro byte.'
        ],
        codeTitle: 'Descobrindo endereços na RAM',
        codeExample: `#include <stdio.h>

int main(void) {
    int idade = 25;
    double salario = 4500.0;
    printf("Valor: %d | Endereco: %p\\n", idade, (void*)&idade);
    printf("Endereco salario: %p\\n", (void*)&salario);
    return 0;
}`,
        pitfall:
          'Achar que &x muda quando você altera o valor de x: o conteúdo da caixa muda, mas o endereço da casa na RAM permanece o mesmo.',
        labId: 'memory-addresses',
        labTitle: 'Mapa Interativo de Endereços na RAM',
        labSubtitle: 'Inspecione o endereço hexadecimal e os bytes ocupados por variáveis na memória.'
      },
      {
        id: '6.2',
        code: '6.2',
        title: 'Declaração e utilização de ponteiros',
        summary:
          'Um ponteiro é uma variável cujo conteúdo é um endereço de memória. Declaramos com * (int *p;) e acessamos ou modificamos o valor apontado usando o operador de desreferenciação (*p).',
        keyPoints: [
          'int *p = &a; -> p guarda o endereço de a.',
          '*p = 99; -> vai até o endereço guardado em p e altera o conteúdo lá dentro (a vira 99).',
          'Sempre inicialize ponteiros não usados com NULL e verifique if (p != NULL) antes de desreferenciar.'
        ],
        codeTitle: 'Indireção e manipulação via ponteiro',
        codeExample: `#include <stdio.h>

int main(void) {
    int a = 10, b = 25;
    int *p = &a;  // p aponta para a
    *p = 40;      // modifica a para 40
    p = &b;       // agora p aponta para b
    (*p)++;       // b vira 26
    printf("a=%d, b=%d\\n", a, b);
    return 0;
}`,
        pitfall:
          'Desreferenciar ponteiro não inicializado (ponteiro selvagem) ou ponteiro NULL provoca Segmentation Fault imediato.',
        labId: 'pointer-sandbox',
        labTitle: 'Sandbox Visual de Ponteiros (*p e &x)',
        labSubtitle: 'Execute operações em p e observe as setas de endereço e valores na RAM atualizando ao vivo.'
      },
      {
        id: '6.3',
        code: '6.3',
        title: 'Relações entre ponteiros, funções e estruturas de dados',
        summary:
          'O nome de um vetor decai para o ponteiro do seu primeiro elemento: v[i] equivale a *(v + i). Além disso, ponteiros viabilizam alocação dinâmica no Heap com malloc e free.',
        keyPoints: [
          'Aritmética de ponteiros escala pelo tamanho do tipo: se p é int*, p + 1 avança sizeof(int) bytes (4 bytes).',
          'malloc(n * sizeof(int)) aloca memória sob demanda no Heap em tempo de execução.',
          'Toda memória alocada com malloc/calloc deve ser devolvida com free(ptr) para evitar vazamento (memory leak).'
        ],
        codeTitle: 'Aritmética de ponteiros e malloc',
        codeExample: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *v = (int*) malloc(3 * sizeof(int));
    if (v == NULL) return 1;

    *(v + 0) = 10;
    *(v + 1) = 20;
    *(v + 2) = 30;

    printf("Segundo elemento: %d\\n", *(v + 1));
    free(v);
    v = NULL; // Evita dangling pointer
    return 0;
}`,
        pitfall:
          'Esquecer free(v) gera memory leak; usar v depois de free(v) gera dangling pointer (use-after-free).',
        labId: 'pointer-arrays-heap',
        labTitle: 'Aritmética *(v + i) e Alocação no Heap',
        labSubtitle: 'Desloque o ponteiro por um vetor e aloque/libere blocos dinâmicos com malloc e free.'
      }
    ]
  },
  {
    id: 'mod-7',
    number: '07',
    title: 'Arquivos',
    description:
      'Persistência de dados em disco: diferença entre texto e binário, fluxo FILE*, abertura segura e leitura/escrita.',
    topics: [
      {
        id: '7.1',
        code: '7.1',
        title: 'Tipos de arquivos',
        summary:
          'Arquivos de texto armazenam caracteres legíveis codificados em ASCII/UTF-8 (ex: "12345" ocupa 5 bytes). Arquivos binários gravam a representação bruta da memória (um int ocupa sempre 4 bytes fixos).',
        keyPoints: [
          'Texto (.txt, .csv): fácil leitura humana, portável entre arquiteturas, mas exige conversão texto <-> número.',
          'Binário (.bin, .dat): compacto, rápido e exato para structs e vetores grandes, porém não legível em editor comum.',
          'O sistema já fornece 3 fluxos abertos: stdin (teclado), stdout (tela) e stderr (erros).'
        ],
        codeTitle: 'Mesmo número em Texto vs Binário',
        codeExample: `/* Número inteiro int x = 12345:
   - Em arquivo texto (fprintf): grava '1','2','3','4','5' -> 5 bytes ASCII
   - Em arquivo binario (fwrite): grava bytes brutos 0x39 0x30 0x00 0x00 -> 4 bytes */`,
        pitfall:
          'Tentar abrir um arquivo binário em bloco de notas esperando ler números legíveis, ou usar modo texto no Windows causando tradução indesejada de \\n para \\r\\n.',
        labId: 'file-types',
        labTitle: 'Comparador Visual: Arquivo Texto vs Binário',
        labSubtitle: 'Digite um inteiro e compare os bytes gravados em disco no modo Texto e no modo Binário.'
      },
      {
        id: '7.2',
        code: '7.2',
        title: 'Ponteiros para arquivos',
        summary:
          'Para manipular arquivos, C utiliza um ponteiro para a estrutura FILE (FILE *fp;). Essa estrutura gerencia o descritor do sistema operacional, o buffer em RAM e o cursor de posição atual.',
        keyPoints: [
          'FILE *fp guarda o endereço da estrutura de controle de fluxo definida em <stdio.h>.',
          'O cursor interno avança automaticamente após cada operação de leitura ou escrita.',
          'Funções como rewind(fp), fseek() e ftell() consultam ou reposicionam esse cursor.'
        ],
        codeTitle: 'Controle do ponteiro e cursor FILE*',
        codeExample: `#include <stdio.h>

int main(void) {
    FILE *fp = fopen("dados.txt", "r");
    if (fp != NULL) {
        long pos = ftell(fp); // Posição inicial: 0
        fgetc(fp);            // Avança 1 byte
        rewind(fp);           // Volta cursor ao byte 0
        fclose(fp);
    }
    return 0;
}`,
        pitfall:
          'Copiar a estrutura FILE por valor em vez de usar FILE *fp: toda a API de stdio.h exige o ponteiro FILE*.',
        labId: 'file-pointer-cursor',
        labTitle: 'Simulador de Cursor FILE *fp',
        labSubtitle: 'Leia caracteres, avance o cursor byte a byte e teste rewind(fp) para retornar ao início.'
      },
      {
        id: '7.3',
        code: '7.3',
        title: 'Abertura e fechamento de arquivos',
        summary:
          'fopen("nome", "modo") solicita ao sistema operacional a abertura do arquivo. Sempre verifique se retornou NULL antes de usar e finalize com fclose(fp) para descarregar o buffer no disco.',
        keyPoints: [
          '"r": leitura (arquivo precisa existir; se não existir, retorna NULL).',
          '"w": escrita (cria se não existir, ou APAGA todo conteúdo anterior se já existir!).',
          '"a": acréscimo/append (cria se não existir, ou grava sempre no final preservando o conteúdo).',
          'Adicione "b" para modo binário: "rb", "wb", "ab". Sempre feche com fclose(fp).'
        ],
        codeTitle: 'Padrão seguro de abertura e fechamento',
        codeExample: `#include <stdio.h>

int main(void) {
    FILE *fp = fopen("notas.txt", "w");
    if (fp == NULL) {
        printf("Erro ao abrir o arquivo!\\n");
        return 1;
    }
    fprintf(fp, "Aluno: Ana | Nota: 9.5\\n");
    fclose(fp); // Descarrega buffer e libera recurso
    return 0;
}`,
        pitfall:
          'Abrir arquivo existente com modo "w" achando que vai adicionar ao final: "w" zera o arquivo imediatamente!',
        labId: 'fopen-modes',
        labTitle: 'Matriz Interativa de Modos fopen()',
        labSubtitle: 'Combine modo ("r", "w", "a", "r+") com existência prévia do arquivo e veja o resultado.'
      },
      {
        id: '7.4',
        code: '7.4',
        title: 'Operações de leitura e escrita',
        summary:
          'Funções de texto (fprintf, fscanf, fgets, fputs) lidam com dados formatados ou linhas; funções binárias (fwrite, fread) transferem blocos inteiros de bytes diretamente da memória para o arquivo e vice-versa.',
        keyPoints: [
          'Texto formatado: fprintf(fp, ...) escreve; fscanf(fp, ...) lê campos; fgets(linha, tam, fp) lê uma linha inteira.',
          'Binário: fwrite(&reg, sizeof(Registro), 1, fp) e fread(&reg, sizeof(Registro), 1, fp).',
          'Prefira testar o retorno de fgets(...) != NULL ou fread(...) == 1 em vez de while (!feof(fp)) para não repetir a última linha.'
        ],
        codeTitle: 'Escrita e leitura de registros',
        codeExample: `#include <stdio.h>

int main(void) {
    FILE *fp = fopen("log.txt", "a");
    if (!fp) return 1;
    fprintf(fp, "Evento registrado\\n");
    fclose(fp);

    fp = fopen("log.txt", "r");
    char linha[100];
    while (fgets(linha, sizeof(linha), fp) != NULL) {
        printf("%s", linha);
    }
    fclose(fp);
    return 0;
}`,
        pitfall:
          'Usar while (!feof(fp)) com fscanf faz o último registro ser processado duas vezes, porque EOF só é ativado após tentar ler além do fim.',
        labId: 'file-io-bench',
        labTitle: 'Bancada de Leitura e Escrita em Arquivos',
        labSubtitle: 'Execute passo a passo a abertura, escrita com fprintf, fechamento e releitura com fgets.'
      }
    ]
  }
];

export const ALL_TOPICS: Topic[] = CURRICULUM.flatMap((m) => m.topics);
