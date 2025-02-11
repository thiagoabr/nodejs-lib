import chalk from "chalk";

let cache = {};

function extraiLinks (arrLinks) {
  return arrLinks.map((objetoLink) => Object.values(objetoLink).join());
}

async function checaStatus (listaURLs) {

  const arrStatus = await Promise.all(
    listaURLs.map(async (url) => {
      if (cache[url])
      {
        return cache[url];
      }
      try {
        const response = await fetch(url);
        cache[url] = response.status;
        return response.status;
      } catch (erro) {
        cache[url] = manejaErros(erro);
        return manejaErros(erro);
      }
    })
  )
  return arrStatus;
}

function manejaErros (erro) {
  let erroTratado = '';
  if (erro.cause.code === 'ENOTFOUND') {
    erroTratado = "O link não encontrado";
  } else if (erro.cause.code === 'ECONNREFUSED') {
    erroTratado = 'A conexão ao servidor falhou';
  } else if (erro.cause.code === 'ETIMEDOUT') {
    erroTratado = 'A requisição demorou para responder';
  } else {
    erroTratado = 'Ocorreu algum erro genérico';
  }
  return chalk.red(erroTratado);
}

export default async function listaValidada (listaDeLinks) {
  const links = extraiLinks(listaDeLinks);
  const status = await checaStatus(links);

  return listaDeLinks.map((objeto, indice) => ({
    ...objeto,
    status: status[indice]
  }))
}