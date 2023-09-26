import { iconDownload, iconFileDowload, iconNoFileDowload, iconPreview, iconNotView, iconLink, iconNoLink } from "./icons.js"
// import fileJson from './geoservicos_ide.json' assert {type: 'json'};
import { listaSvg } from "./listaSvg.js"
// import { dadosBruto } from '../../script.js';

const arr_ideOrgaos = []
const arr_ideTematica = []
let returnObj = {}
let dadosBruto = [];
let arrFileJson = []

// export async function fetchGeoservicos(dadosBruto) {
export async function fetchGeoservicos() {

  const baseUrl = `http://10.36.113.107:3000/v1/`
  const rota = 'listgeoservicos'

  await fetch(baseUrl+rota)
    .then(response => response.json())
    .then(data => geoservicosIDE(data) )
    .catch(error => {
      console.error(rota, error)
    });
}

export function geoservicosIDE(dadosBruto) {
  //const dadosBruto = Object.entries(fileJson) //convert to array
  // console.log('--dadosBrutos', dadosBruto)

  // dadosBruto.map((item, index) => {
  dadosBruto.map(( [_, item], index) => {

    // if(index == 0 ) console.log('--item', item);

    if (item.layername_sublayer) return

    arrFileJson.push({
      id: index,
      camada: item.layername,
      download: item.download_shapefile,
      geoservico: item.geoservico_ide,
      metadado: item.metadado_uuid,
      metadado_search: item.metadados_search,
      orgao: item.copyrighttext,
      tematica: item.group_tematica,
      visualizacao: item.visualization,
      metadadoPDF: item.metadados_pdf
    })

    return arrFileJson
  })
  // console.log('--arrFileJson', arrFileJson)

  arrFileJson.map(item => arr_ideTematica.push(item.tematica))
  arrFileJson.map(item => arr_ideOrgaos.push(item.orgao))

  const uniqueTematica = [...new Set(arr_ideTematica)]
  const uniqueOrgaos = [...new Set(arr_ideOrgaos)]

  returnObj = {
    uniqueTematica: uniqueTematica,
    uniqueOrgaos: uniqueOrgaos,
    arrFileJson: arrFileJson
  }
  // console.log('--returnObj', returnObj)

  let key = "tematica"

  // console.log(findOcc(arrFileJson, key))

  function findOcc(arr, key){

      let arr2 = [];

      arr.forEach((item)=>{
          // Verificando se existe algum objeto em arr2
          // que contém o valor da chave
          const verify = arr2.some((val) => val[key] == item[key] )

          if (verify) {
              // If yes! then increase the occurrence by 1
              arr2.forEach((k)=>{
                  if(k[key] === item[key]){
                      k["count"]++
                  }
              })
          } else {
              // Se não, cria um novo objeto inicializando-o
              // com o valor da chave de iteração atual e
              // define a ocorrência para 1
              let a = {}
              a[key] = item[key]
              a["count"] = 1
              arr2.push(a);
          }
      })

      return arr2
  }

  renderContents(returnObj, findOcc(arrFileJson, key))

  return returnObj
}

function renderContents(tematica, arr2) {
  // console.log('--tematica', tematica.uniqueTematica)

  const arrForSort = []

  tematica.uniqueTematica.filter( (item, index) => {
    // console.log(item)

    const printText = arr2[index].count > 1 ? 'itens' : 'item';

    const resultListaSvg = listaSvg.filter(ele => {

      if(ele.id == undefined || item == undefined) return console.log('Valores undefined na url listgeoservicos')

      const elementId = ele.id.toLowerCase()
      const itemtId = item.toLowerCase()
      // const elementId = ele.id.toLocaleLowerCase()
      // const itemtId = item.toLocaleLowerCase()

      // console.log(elementId)
      // console.log(itemtId)

      if (elementId == itemtId ) return ele.svg
    })
    // console.log('--resultListaSvg', resultListaSvg)

    // if (1 == 1 ) return

    const nameTematica = item.replace(/_/g, ' ');

    const div_headerTematica = `
                            <div class="headerTematica">
                                <h3>${nameTematica}</h3>

                                <p>${arr2[index].count} ${printText}</p>
                            </div>

                            <div class="c_tematicaSvg">
                                ${ resultListaSvg[0].svg }
                            </div>
                            `

    arrForSort.push({id: nameTematica, headerTematica: div_headerTematica})
  })

  const arrForSorted = arrForSort.sort((a, b) => a.id.localeCompare(b.id));
  // console.log('--arrForSort', arrForSort)

  arrForSorted.filter((item) => {

    let boxTematica = document.createElement('div')
    boxTematica.classList.add(`c_tematica`)

    boxTematica.innerHTML = item.headerTematica

    document.querySelector("#build2").appendChild(boxTematica)
    boxTematica.addEventListener('click', modalFn )
  })
}

// const linkConcat = 'https://www.metadados.seduh.df.gov.br/geonetwork/srv/por/catalog.search#/search?any=';
const linkConcat = "https://www.metadados.seduh.df.gov.br/geonetwork/srv/por/catalog.search#/metadata/"

const linkConcat_download_part1 = 'https://www.metadados.seduh.df.gov.br/geonetwork/srv/api/records/';
const linkConcat_download_part2 = '/formatters/xsl-view?output=pdf&language=por&approved=true';
const linkConcatVisualizacao = '';

function modalFn(e) {
  // console.log(this)
  const arrForSort = []

  const divWrapModal = window.document.createElement('div')
  divWrapModal.setAttribute('class', 'divWrapModal')

  const fade = window.document.createElement('div')
  fade.setAttribute('class', 'fade')

  const divModal = document.createElement('div')
  divModal.setAttribute('class', 'divModal')

  const intoModal = document.createElement('div')
  intoModal.setAttribute('class', 'intoModal')

  document.body.appendChild(divWrapModal)
  divWrapModal.appendChild(fade)
  divWrapModal.appendChild(divModal)
  divModal.appendChild(intoModal)

  // const svgClose = document.createElement('div')
  // svgClose.setAttribute('class', 'svgClose')

  // divModal.append(svgClose)
  // intoModal.appendChild(svgClose)

  returnObj.arrFileJson.filter((item, index) => {
      // console.log(index, item)

      const nameContent = this.querySelector("h3").textContent
      const itemTematica = item.tematica.replace(/_/g, ' ');

      if(itemTematica == nameContent){
          // console.log(item)
          // console.log('--item.metadadoPDF', item.metadadoPDF)
          // console.log(item.camada)
          // console.log(item.metadado )
          // console.log(item.metadadoPDF)

        intoModal.innerHTML = `
                                <h1>${nameContent}</h1>
                                <div class="svgClose">Fechar (Esc)</div>
                                `

        const verificaVisualizacao = item.visualizacao !== null
        ? `<a href="${linkConcatVisualizacao}${item.visualizacao}" target="_blank">${iconPreview} Visualização</a>`
        : `<c class="noView">${iconNotView} Visualização</c>`;

        const verificaMetadado = item.metadado !== 'PENDENTE'
            ? `<a href="${linkConcat}${item.metadado}" target="_blank">${iconLink} Metadado</a>`
            : `<a href="${item.metadado_search}" target="_blank">${iconLink} Metadado</a>`

        const verificaMetadadoPDF = item.metadadoPDF !== null
            ? `<a href="${linkConcat_download_part1}${item.metadadoPDF}${linkConcat_download_part2}" target="_blank">${iconDownload} Metadado PDF</a>`
            : `<c class="noView">${iconNoFileDowload} Metadado PDF</c>`;

        const verificaGeoservico = item.geoservico !== null
            ? `<a href="${item.geoservico}" target="_blank">${iconLink} Geoserviço</a>`
            : `<c class="noView">${iconNoLink} Geoserviço</c>`;

        const verificaDownload = item.download !== null
            ? `<a href="${item.download}" target="_blank">${iconFileDowload} Download</a>`
            : `<c class="noView">${iconNoFileDowload} Download</c>`;

        const div_camada = `
                        <p>${item.orgao} - ${item.camada}</p>
                        <div>
                            <!--${verificaVisualizacao}-->
                            ${verificaMetadado}
                            ${verificaMetadadoPDF}
                            ${verificaGeoservico}
                            ${verificaDownload}
                        </div>
                        `

        arrForSort.push({id: item.camada, div_camada: div_camada})
      }
  })

  const arrForSorted = arrForSort.sort((a, b) => a.id.localeCompare(b.id));
  // console.log('--arrForSort', arrForSort)


  arrForSorted.filter((item) => {
    // console.log(item)
    const div = window.document.createElement('div')
    div.setAttribute('class', 'dadosDisponiveis')

    div.innerHTML = item.div_camada
    divModal.appendChild(div)
  })


  window.addEventListener('keydown', closeModalESC)

  function closeModalESC(){
      if (event.key === 'Escape') {
          // console.log(event.key, 'esc')
          divWrapModal.remove()
          window.removeEventListener('keydown', closeModalESC)
      }
  }

  divWrapModal.addEventListener('click', (e)=>{
      // console.log(e.target.className)
      // console.log(e.target.getAttribute("class"))

      const targetClassName = e.target.className

      const classList = ['fade', 'svgClose']

      const shoulCloseModal = classList.some(item => item == targetClassName || item == targetClassName.baseVal)

      if(shoulCloseModal) { divWrapModal.remove() }
  })
}

document
  .querySelector(".container .wrap_search .svgSearch")
  .addEventListener('click', inputSearchFn)

document
  .querySelector(".container .wrap_search input")
  .addEventListener('keyup', controlerSearch)

function controlerSearch(e) {
    // console.log(this.value)

    const searchBtnClear = document.querySelector(".container .wrap_search .searchBtnClear")

    searchBtnClear.addEventListener('click', (event) => {
        const inputSearch = document.querySelector(".container .wrap_search input")
        inputSearch.value = ''
        searchBtnClear.style.display = "none"
        inputSearchFn(event)
    })

    if (e.key == 'Enter') {
        // console.log(e)
        inputSearchFn(e)
    }

    if (this.value === '' ) {
        searchBtnClear.style.display = "none"
    }
    else {
        searchBtnClear.style.display = 'block'
    }
}

function inputSearchFn (e) {
    // console.log(e)

  document.querySelector("#build2").innerHTML = ''

  const inputSearch = document.querySelector(".container .wrap_search input")

  let inputSearchValue = inputSearch.value.toLowerCase()

  if (inputSearchValue !== '') {
      document.querySelector("#build").innerHTML = ''

      let filtrados = returnObj.arrFileJson.filter(item => (new RegExp(inputSearchValue)).test(item.camada.toLocaleLowerCase()));

      filtrados.map( (item, index) => {

          document.querySelector("#build2").innerHTML = ''

          const div = window.document.createElement('div')
              div.setAttribute('class', 'dadosDisponiveis')

          const verificaVisualizacao = item.visualizacao !== null
          ? `<a href="${linkConcatVisualizacao}${item.visualizacao}" target="_blank">${iconPreview} Visualização</a>`
          : `<c class="noView">${iconNotView} Visualização</c>`;

          const verificaMetadado = item.metadado !== 'PENDENTE'
            ? `<a href="${linkConcat}${item.metadado}" target="_blank">${iconLink} Metadado</a>`
            : `<a href="${item.metadado_search}" target="_blank">${iconLink} Metadado</a>`

          const verificaMetadadoPDF = item.metadadoPDF !== null
              ? `<a href="${linkConcat_download_part1}${item.metadadoPDF}${linkConcat_download_part2}" target="_blank">${iconDownload} Metadado PDF</a>`
              : `<c class="noView">${iconNoFileDowload} Metadado PDF</c>`;

          const verificaGeoservico = item.geoservico !== null
              ? `<a href="${item.geoservico}" target="_blank">${iconLink} Geoserviço</a>`
              : `<c class="noView">${iconNoLink} Geoserviço</c>`;

          const verificaDownload = item.download !== null
              ? `<a href="${item.download}" target="_blank">${iconFileDowload} Download</a>`
              : `<c class="noView">${iconNoFileDowload} Download</c>`;

          div.innerHTML = `
                          <p>${item.orgao} - ${item.camada}</p>
                          <div>
                              <!--${verificaVisualizacao}-->
                              ${verificaMetadado}
                              ${verificaMetadadoPDF}
                              ${verificaGeoservico}
                              ${verificaDownload}
                          </div>
                          `

                  const idBuild = document.querySelector("#build")
                  idBuild.appendChild(div)
      })

  }
  else {
    geoservicosIDE(dadosBruto)

    document.querySelector("#build").innerHTML = ''
    }
}
