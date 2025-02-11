import chalk from 'chalk';
import fs from 'fs';
import pegaArquivo from './index.js';
import listaValidada from './http-validacao.js';

const caminho = process.argv;

async function imprimeLista(valida, formato, resultado, identificador = '') {
  if (valida && !formato) {
    console.log(
      chalk.yellow('lista validada'),
      chalk.black.bgGreen(identificador),
      await listaValidada(resultado.links),
      chalk.yellow('Total de Links: ' + resultado.total)); 
  } else if (formato) {
    console.log(JSON.stringify(resultado.links));
  } else {
    console.log(
      chalk.yellow('lista de links'),
      chalk.black.bgGreen(identificador),
      resultado.links,
      chalk.yellow('Total de Links: ' + resultado.total));
  }
}

async function processaTexto(argumentos) {
  const caminho = argumentos[2];
  const valida = argumentos[3] === '--valida';
  const formato = argumentos[4] === '--json';

  try {
    fs.lstatSync(caminho);
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      console.log(chalk.bgRed('arquivo ou diretório não existe'));
      return;
    }
  }

  if (fs.lstatSync(caminho).isFile()) {
    const resultado = await pegaArquivo(argumentos[2]);
    imprimeLista(valida, formato, resultado);
  } else if (fs.lstatSync(caminho).isDirectory()) {
    const arquivos = await fs.promises.readdir(caminho)
    arquivos.forEach(async (nomeDeArquivo) => {
      const lista = await pegaArquivo(`${caminho}/${nomeDeArquivo}`)
      imprimeLista(valida, formato, lista, nomeDeArquivo)
    })
  }
}

processaTexto(caminho);