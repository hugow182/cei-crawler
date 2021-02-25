# cei-crawler 💸

![Travis badge](https://travis-ci.com/Menighin/cei-crawler.svg?branch=master) ![Coveralls badge](https://coveralls.io/repos/github/Menighin/cei-crawler/badge.svg?branch=master&kill-cache=3) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Crawler para ler dados do Canal Eletrônico do Investidor 

## Descrição
O `cei-crawler` utiliza as seguintes dependências:
* [cheerio](https://github.com/cheeriojs/cheerio) para fazer o parse do HTML.
* [node-fetch](https://github.com/node-fetch/node-fetch) para fazer as requisições
* [abort-controller](https://github.com/mysticatea/abort-controller) para controlar o timeout das requisições
* [tough-cookie](https://github.com/salesforce/tough-cookie) para auxiliar no gerenciamento dos cookies
* [normalize-html-whitespace](https://www.npmjs.com/package/normalize-html-whitespace) para fazer a limpeza do HTML do CEI

Cada instância do `CeiCrawler` roda em um contexto separado, portante é possível realizar operações em usuários diferentes de forma simultânea


## Sponsor
Caso o `cei-crawler` tenha te ajudado e você queira fazer alguma doação pra me ajudar a mantê-lo, utilize o QR code abaixo :)
Mande também seu nome e usuário do GitHub (caso tenha) que eu coloco aqui no README. Obrigado!

<p align="center">
  <img src="./sponsor/picpay.png" width="150">
</p>

## Advertisement
Criei o `cei-crawler` para um projeto de acompanhamento de investimentos. Caso esteja procurando algo nesse sentido, confira o [Stoincs](https://www.stoincs.com.br)!

<p align="center">
  <a href="https://stoincs.com.br" target="_blank"><img src="./advertisement/snout.svg" width="50"></a>
</p>

## Instalação
Basta instalar utilizando o NPM:
```
npm install --save cei-crawler
```

## Utilização
Crie uma instância do `CeiCrawler` passando os parametros necessários e invoque o método desejado:

```javascript
let ceiCrawler = new CeiCrawler('username', 'password', {/* options */});
ceiCrawler.login(); // Login é opcional, pois antes de cada método o cei-crawler irá verificar se já esta logado.
                    // A vantagem em realizar o login em um passo diferente é para o tratamento de erros
```

### Métodos disponíveis
#### getWallet(_date_)
Retorna os dados das carteiras no CEI. As carteiras contém as posições consolidades de ativos e tesouro direto.
O retorno será uma lista com cada item representando os dados de uma instituição e conta.
O método recebe uma data como parâmetro para pegar a foto das carteiras no dia escolhido. Se nenhuma data for passada, será utilizada a data padrao do CEI que é o dia corrente. O CEI disponibiliza datas somente em um range de 2 meses, aparentemente.

```javascript
let wallets = await ceiCrawler.getWallet(date);
```
Resultado:
```javascript
[
  {
    "institution": "1111 - INTER DTVM LTDA",
    "account": "111111",
    "stockWallet": [
      {
        "company": "BANCO INTER",
        "stockType": "PN N2",
        "code": "BIDI4",
        "isin": "BRBIDIACNPR0",
        "price": 11.43,
        "quantity": 100,
        "quotationFactor": 1,
        "totalValue": 1143
      },
      {
        "company": "CENTAURO",
        "stockType": "ON NM",
        "code": "CNTO3",
        "isin": "BRCNTOACNOR5",
        "price": 29,
        "quantity": 100,
        "quotationFactor": 1,
        "totalValue": 2900
      }
    ],
    "treasureWallet": []
  },
  {
    "institution": "222222 - RICO INVESTIMENTOS - GRUPO XP",
    "account": "2222222",
    "stockWallet": [
      {
        "company": "TENDA",
        "stockType": "ON NM",
        "code": "TEND3",
        "isin": "BRTENDACNOR4",
        "price": 25.14,
        "quantity": 100,
        "quotationFactor": 1,
        "totalValue": 2514
      }
    ],
    "treasureWallet": [
      {
        "code": "Tesouro IPCA+ 2024",
        "expirationDate": "2019-06-12T03:00:00.000Z",
        "investedValue": 1000.00,
        "grossValue": 1500.00,
        "netValue": 1400.00,
        "quantity": 0.25,
        "blocked": 0
      }
    ]
  }
]
```

#### getWalletOptions()
Retorna as opções dos formulários da página de carteira de ativos
```javascript
const walletOptions = await ceiCrawler.getWalletOptions();
```
Resultado:
```javascript
{
  "minDate": "02/06/2020",
  "maxDate": "31/07/2020",
  "institutions": [
    {
      "value": "123",
      "label": "123 - RICO INVESTIMENTOS - GRUPO XP",
      "accounts": [
        "12345"
      ]
    },
    {
      "value": "321",
      "label": "321 - INTER DTVM LTDA",
      "accounts": [
        "54321"
      ]
    }
  ]
}
```

#### getStockHistory(_startDate_, _endDate_)
Método que processa o histórico e o resumo do histórico de compra e venda de ações. O retorno será um uma lista com todas operações de compra ou venda efetuadas dentro do período informado, se nenhuma data for passada o método retornará todo o histórico disponível.
```javascript
let stockHistory = await ceiCrawler.getStockHistory(startDate, endDate);
```
Resultado:
```javascript
[
    {
        institution: 'Banco Inter',
        account: 12345,
        stockHistory: [
            {
                date: "2019-06-12T03:00:00.000Z",
                operation: "C", // C (Compra) ou V (Venda),
                market: "Mercado a Vista",
                expiration: "",
                code: "BTOW3",
                name: "B2W DIGITAL ON NM",
                quantity: 200,
                price: 32.2,
                totalValue: 6440,
                cotation: 1
            }
        ]
    }
]
```
#### getStockHistoryOptions()
Retorna as opções dos formulários da página de negociações de ativos
```javascript
const stockHistoryOptions = await ceiCrawler.getStockHistoryOptions();
```
Resultado:
```javascript
{
  "minDate": "08/02/2019",
  "maxDate": "31/07/2020",
  "institutions": [
    {
      "value": "123",
      "label": "123 - RICO INVESTIMENTOS - GRUPO XP",
      "accounts": [
        "12345"
      ]
    },
    {
      "value": "321",
      "label": "321 - INTER DTVM LTDA",
      "accounts": [
        "54321"
      ]
    }
  ]
}
```


#### getDividends(_date_)
Método que processa todos os dados disponíveis sobre proventos recebidos em um período e retorna como uma lista. Usualmente os proventos disponíveis na página do CEI são os creditados no mês atual e os já anunciados pela empresas com e sem data definida. Registros com date igual `null` são de proventos anunciados mas sem data definida de pagamento.
```javascript
let dividends = await ceiCrawler.getDividends(date);
```
Resultado:
```javascript
[
  {
    "institution": "1099 - INTER DTVM LTDA",
    "account": "12345",
    "futureEvents": [
      {
        "stock": "BANCO INTER",
        "stockType": "PN N2",
        "code": "BIDI4",
        "date": "2020-08-20T03:00:00.000Z",
        "type": "JUROS SOBRE CAPITAL PRÓPRIO",
        "quantity": 200,
        "factor": 1,
        "grossValue": 7.88,
        "netValue": 5.8
      },
      {
        "stock": "CIA HERING",
        "stockType": "ON NM",
        "code": "HGTX3",
        "date": null,
        "type": "JUROS SOBRE CAPITAL PRÓPRIO",
        "quantity": 100,
        "factor": 1,
        "grossValue": 21.96,
        "netValue": 18.67
      },
    ],
    "pastEvents": [
      {
        "stock": "ITAUSA",
        "stockType": "PN N1",
        "code": "ITSA4",
        "date": "2020-07-01T03:00:00.000Z",
        "type": "DIVIDENDO",
        "quantity": 300,
        "factor": 1,
        "grossValue": 6,
        "netValue": 6
      }
    ]
  },
  {
    "institution": "386 - RICO INVESTIMENTOS - GRUPO XP",
    "account": "12345",
    "futureEvents": [],
    "pastEvents": [
      {
        "stock": "FII CSHG LOG",
        "stockType": "CI",
        "code": "HGLG11",
        "date": "2020-07-14T03:00:00.000Z",
        "type": "RENDIMENTO",
        "quantity": 100,
        "factor": 1,
        "grossValue": 78,
        "netValue": 78
      }
    ]
  }
]
```
#### getDividendsOptions()
Retorna as opções dos formulários da página de proventos
```javascript
const dividendsOptions = await ceiCrawler.getDividendsOptions();
```
Resultado:
```javascript
{
  "minDate": "27/07/2020",
  "maxDate": "31/07/2020",
  "institutions": [
    {
      "value": "123",
      "label": "123 - RICO INVESTIMENTOS - GRUPO XP",
      "accounts": [
        "12345"
      ]
    },
    {
      "value": "321",
      "label": "321 - INTER DTVM LTDA",
      "accounts": [
        "54321"
      ]
    }
  ]
}
```

#### getTreasure(_date_)
Método que processa todos os dados disponíveis sobre Tesouro Direto em um período e retorna como uma lista e também uma lista das transações.
```javascript
let treasures = await ceiCrawler.getTreasures(date);
```
Resultado:
```javascript
[
    {
        "institution": "3 - XP INVESTIMENTOS CCTVM S/A",
        "account": "123456",
        "treasures": [
            {
                "code": "Tesouro IPCA+ 2045",
                "expirationDate": "2045-05-15T03:00:00.000Z",
                "investedValue": 12.34,
                "grossValue": 13.43,
                "netValue": 10.12,
                "quantity": 0.01,
                "blocked": 0,
                "transactions": [
                    {
                        "tradeDate": "2020-11-27T03:00:00.000Z",
                        "quantity": 0.01,
                        "price": 1234.56,
                        "notional": 12.34,
                        "profitability": "IPCA + 4,05%",
                        "grossProfitability": "IPCA + 566,89%",
                        "grossProfitabilityPercent": 12.34,
                        "grossValue": 45.67,
                        "investmentTerm": 18,
                        "taxBracket": 23.4,
                        "taxIrValue": 0.12,
                        "taxIofValue": 1.94,
                        "feeB3Value": 0,
                        "feeInstitutionValue": 0,
                        "netValue": 42.67
                    }
                ]
            }
        ]
    }
]
```
#### getTreasureOptions()
Retorna as opções dos formulários da página de tesouro direto
```javascript
const treasureOptions = await ceiCrawler.getTreasureOptions();
```
Resultado:
```javascript
{
  "institutions": [
    {
      "value": "123",
      "label": "123 - RICO INVESTIMENTOS - GRUPO XP",
      "accounts": [
        "12345"
      ]
    },
    {
      "value": "321",
      "label": "321 - INTER DTVM LTDA",
      "accounts": [
        "54321"
      ]
    }
  ]
}
```

## Opções
Na criação de um `CeiCrawler` é possivel especificar alguns valores para o parâmetro `options` que modificam a forma que o crawler funciona. As opções são:

| Propriedade           | Tipo      | Default | Descrição                                                                                                                                                                                               |
|-----------------------|-----------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **capDates**          | _Boolean_ | _false_ | Se `true`, as datas utilizadas de input para buscas serão limitadas ao range de datas válidas do CEI, impedindo que ocorra um erro caso o usuário passe uma data maior ou menor.                        |
| **navigationTimeout** | _Number_  | 30000   | Tempo, em ms, que o crawler espera por uma ação antes de considerar timeout. |
| **loginTimeout** | _Number_  | 180000   | Tempo, em ms, que o crawler espera para realizar login antes de considerar timeout. Diversas vezes, como a noite e aos fins de semana, o sistema do CEI parece ficar muito instavél e causa diversos timeouts no login. |
| **trace**             | _Boolean_ | _false_ | Printa mensagens de debug no log. Útil para desenvolvimento.                                                                                                                                            |

Exemplo:

```javascript
const ceiCrawlerOptions = {
    trace: false,
    capEndDate: true,
    navigationTimeout: 60000,
    loginTimeout: 240000,

};

let ceiCrawler = new CeiCrawler('username', 'password', ceiCrawlerOptions);
``` 

## Error Handling
O CEI Crawler possui um exceção própria, `CeiCrawlerError`, que é lançada em alguns cenários. Essa exceção possui um atributo `type` para te direcionar no tratamento:

| type           | Descrição                                                                                                                 |
|----------------|---------------------------------------------------------------------------------------------------------------------------|
| LOGIN_FAILED   | Lançada quando o login falha por timeout ou por CPF errado digitado                                                       |
| WRONG_PASSWORD | Lançada quando a senha passada está errada                                                                                |
| SUBMIT_ERROR   | Lançada quando acontece um erro ao submeter um formulario de pesquisa em alguma página do CEI. Por exemplo: data inválida |
| SESSION_HAS_EXPIRED   | Lançada quando a sessão do usuário expira, nesse caso é necessário realizar o login novamente `ceiCrawler.login()` |
| NAVIGATION_TIMEOUT   | Lançada quando a requisição estoura o tempo limite definida na opção `navigationTimeout` |


Exemplo de como fazer um bom tratamento de erros:

```javascript
const CeiCrawler = require('cei-crawler');
const { CeiErrorTypes } = require('cei-crawler')

const ceiCrawler = new CeiCrawler('usuario', 'senha', { navigationTimeout: 20000 });

try {
  const wallet = ceiCrawler.getWallet();
} catch (err) {
  if (err.name === 'CeiCrawlerError') {
    if (err.type === CeiErrorTypes.LOGIN_FAILED)
      // Handle login failed
    else if (err.type === CeiErrorTypes.WRONG_PASSWORD)
      // Handle wrong password
    else if (err.type === CeiErrorTypes.SUBMIT_ERROR)
      // Handle submit error
    else if (err.type === CeiErrorTypes.SESSION_HAS_EXPIRED)
      // Handle session expired
    else if (err.type === CeiErrorTypes.NAVIGATION_TIMEOUT)
      // Handle request timeout
  } else {
    // Handle generic errors
  }
}
```

## Features
- [x] Histórico de ações
- [x] Dividendos
- [x] Carteira de ações
- [x] Tesouro Direto (Resumido)
- [x] Tesouro Direto (Analítico)

## Licença
MIT
teste