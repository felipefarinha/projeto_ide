import fileJson from './geoservicos_ide.json' assert {type: 'json'};
import { verificaDispositivo, isMobileDevice } from './assets/js/verificaDispositivo.js' ;
import { fetchUsers } from './assets/js/avisos.js'

import { fetchGeoservicos, geoservicosIDE } from './assets/js/geoservicosFn.js';
export const dadosBruto = Object.entries(fileJson) //convert to array
geoservicosIDE(dadosBruto)
// fetchGeoservicos()

//==============================================================================
// atualiza nomes

const listaNomes = [
    {
        titular: 'Wisney Rafael Alves de Oliveira, matrícula n° 279.261-3',
        suplente: 'Luís Fernando Rodrigues de Abreu, matrícula nº 265.125-4',
        identificador: 'Secretaria de Estado de Economia do Distrito Federal - SEEC',
        class: 'SEEC'
    },
    {
        titular: 'Tânia Maria Vieira da Silva',
        suplente: 'Ayla Narjara de Carvalho Vieira',
        identificador: 'Secretaria Executiva da IDE/DF',
        class: 'secExIDE'
    },
]

function setName(lista) {
    lista.forEach((item, i) => {
        // console.log(item.class)
        document.querySelectorAll(`.${item.class}`).forEach(ele => {
            // console.log(ele, i)
            ele.innerHTML = ` Titular: ${lista[i].titular} <br> Suplente: ${lista[i].suplente} <br>`;
        })
    })
}
setName(listaNomes)
//==============================================================================
// navbar-menu background color and footer position

const navbar_lista = document.querySelectorAll('.navbar_lista')
// console.log(navbar_lista)

navbar_lista.forEach(item => {
    item.addEventListener('click', () => {
        navbar_lista.forEach(item => item.classList.remove("active"))
        item.classList.add("active")
        // footerPosition()
    })
})
//==============================================================================
// summary click position footer
// document
//     .querySelectorAll('summary')
//     .forEach(item => item.addEventListener('click', () => {
//         footerPosition()
//     }))
//==============================================================================
// function navbar-menu Abas

const section_list = document.querySelectorAll('.section')

section_list[0].style.display = "block" //first item active

navbar_lista.forEach(function (item, i) {
    item.addEventListener('click', () => {
        section_list.forEach(item => item.style.display = "none") //none para todos
        section_list[i].style.display = "block" //block para o atual clicado
    })
})
//==============================================================================
//leva até a aba Adesão

document.querySelector("#click")
    .addEventListener("click", () => {
        document.querySelector("body > div.container > div > div.container-right > div > ul > li:nth-child(6) > a").click()
    })

//==============================================================================
// imagens da aba inicial

const listaLateral = document.querySelectorAll(".lista-lateral ")

listaLateral.forEach(item => {
    const sectionLeftImg = document.querySelector(`.wrap-section-left-img`)

    item.addEventListener('mouseover', () => {
        // console.log(item.innerText)

        if (item.innerText == 'GEOPORTAL IDE/DF') {
            sectionLeftImg.src = "./assets/imagens/bg-geoportal.png"
        }
        else if (item.innerText == 'CATÁLOGOS DE METADADOS IDE/DF') {
            sectionLeftImg.src = "./assets/imagens/metadados.png"
        }
        else if (item.innerText == 'INDE') {
            sectionLeftImg.src = "./assets/imagens/inde.png"
        }
        else if (item.innerText == 'GEOSERVIÇOS') {
            sectionLeftImg.src = "./assets/imagens/Geoserviços.png"
        }
        else if (item.innerText == 'BRASÍLIA AMBIENTAL') {
            sectionLeftImg.src = "./assets/imagens/IBRAM.png"
        }
        else if (item.innerText == 'CAESB') {
            sectionLeftImg.src = "./assets/imagens/CAESB.png"
        }
        else if (item.innerText == 'SISDIA') {
            sectionLeftImg.src = "./assets/imagens/SISDIA.png"
        }
    })
    item.addEventListener('mouseout', () => {
        sectionLeftImg.src = "./assets/imagens/bg-geoportal.png"
    })
})
//==============================================================================
//section comunicados

const fetchAllArr = [];
const mount = []
const numOfQuerys = 5

await fetchUsers(numOfQuerys).then(users => fetchAllArr.push(users.text, users.img, users.user.results) );

const date = new Date()

fetchAllArr[0].filter((item, index) => {
    // console.log(fetchAllArr[2][index])

    mount.push( `
        <div class='wrap_comunicados'>
            <div>
                <img src="${fetchAllArr[1][index].download_url} " alt="" />
            </div>
            <div class="wrap_text_content">
                <div class='text_content'>
                    <h3>${fetchAllArr[2][index].location.city} - ${fetchAllArr[2][index].location.state}
                    (${fetchAllArr[2][index].location.coordinates.latitude} ${fetchAllArr[2][index].location.coordinates.longitude})</h3>
                    <p>${item}</p>

                </div>
                <div class='logPost'>
                    <p>Por ${fetchAllArr[2][index].name.first} ${fetchAllArr[2][index].name.last}</p>
                    <p>${date.getDay()}/${date.getMonth() +1}/${date.getFullYear()}</p>
                </div>
            </div>

        </div>
    `)
    // console.log(mount)
})

// document.querySelector('#section_comunicados').innerHTML = mount.join('')
//==============================================================================
// carousel notícias/avisos

let mainPosts = document.querySelectorAll(".main-post");
let posts = document.querySelectorAll(".post");

let i = 0;
let postIndex = 0;
let currentMainPost = mainPosts[postIndex];
let currentPost = posts[postIndex];

setInterval(progress, 100); // 180

function progress() {

  if (i === 100) {
    console.log(i)

    i = 0 -5;
    // reset progress bar
    currentPost.querySelector(".progress-bar__fill").style.width = 0;
    document.querySelector(".progress-bar--primary .progress-bar__fill").style.width = 0;
    currentPost.classList.remove("post--active");

    postIndex++;

    currentMainPost.classList.add("main-post--not-active");
    currentMainPost.classList.remove("main-post--active");

    // reset postIndex to loop over the slides again
    if (postIndex === posts.length) { postIndex = 0; }

    currentPost = posts[postIndex];
    currentMainPost = mainPosts[postIndex];
  }
  else {
    console.log(i)

    i++;
    currentPost.querySelector(".progress-bar__fill").style.width = `${i}%`;
    document.querySelector(".progress-bar--primary .progress-bar__fill").style.width = `${i}%`;
    currentPost.classList.add("post--active");

    currentMainPost.classList.add("main-post--active");
    currentMainPost.classList.remove("main-post--not-active");
  }
}



//==============================================================================

//alinha o footer no bottom

// function footerPosition() {
//     verificaDispositivo()
//     let footer = document.getElementsByTagName('footer')[0]
//     footer.removeAttribute('style')

//     setTimeout(() => {
//         let footerPositionTop = document.getElementsByTagName('footer')[0].getBoundingClientRect().top

//         const medidaContainer = 650

//         if (!isMobileDevice && (footerPositionTop <= medidaContainer)) {
//             let tamanhoTela = window.innerHeight
//             let heightFooter = footer.clientHeight
//             let footerPosition = (tamanhoTela - heightFooter)

//             footer.style.position = 'absolute';
//             footer.style.top = `${footerPosition}px`
//         }
//     }, 50)
// }

//==============================================================================
//NÃO ESTÁ USANDO NADA

//atribui no bottom de download o texto de link do (summary a)

// let arrTexts = []
// let arrLinks = []

// const listaSumarioLinkText = document.querySelectorAll('.lista-sumario a')

// for (let i = 0; i < listaSumarioLinkText.length; i++) {
//     arrTexts.push(listaSumarioLinkText[i].text)
//     arrLinks.push(listaSumarioLinkText[i].href)
// }

// const wrapaBtn = document.querySelectorAll('.wrap-aBtn a')

// wrapaBtn.forEach((item, i) => {
//     item.innerHTML = `
//                         <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000"><g><rect fill="none" height="24" width="24"/></g><g><path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z"/></g></svg>
//                         `

//     // item.addEventListener('mouseover', () => {
//     item.setAttribute('href', `${arrLinks[i]}`)
//     item.setAttribute('target', '_blanck')
//     item.setAttribute('download', `${arrTexts[i]}.pdf`)
//     item.style.cssText = `
//                         width: auto;
//                         background-color: var(--bg-section);
//                         filter: brightness(1.2);
//                         color: white;
//                         fill: white;
//                         cursor: pointer;
//                         `

//     item.innerHTML = `
//                         <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#fff"><g><rect fill="none" height="24" width="24"/></g><g><path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z"/></g></svg>
//                         ${arrTexts[i]}
//                         `

//     //     item.addEventListener('mouseout', () => {
//     //         item.removeAttribute('style')
//     //         item.innerHTML = `
//     //                         <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z"/></g></svg>
//     //                         `
//     //     })
//     // })
// })

// setInterval(() => { buildDadosDisponiveis() }, 1000 * 60 * 60 * 24 / 2) //a cada 12h

//==============================================================================
//NÃO ESTÁ USANDO NADA

// form validation

// const form = document.getElementById('form');
// const mensagem = document.querySelector('.mensagem');

// let { name, email, instt, fsub } = form;

// let db_formulario = [];

// form.addEventListener('keyup', (e) => { mensagem.textContent = " " });
// name.addEventListener('keyup', (e) => { let valorInput = e.target.value; name.value = valorInput.replace(/[0-9]/g, '') });

// document.addEventListener('submit', (e) => {
//     e.preventDefault();

//     const validarRegExNoEmail = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

//     if (email.value.match(validarRegExNoEmail)) {
//         email.style.cssText = 'border: 2px solid green;'
//         name.style.cssText = 'border: 2px solid green;'
//         instt.style.cssText = 'border: 2px solid green;'

//         db_formulario.push({ name: name.value.trim(), email: email.value, instt: instt.value })
//         mensagem.textContent = "Enviado com sucesso"
//     }
//     else {
//         email.style.cssText = 'border: 2px solid red;'
//         console.log('erro formulário')
//     }
//     // console.log(db_formulario)
//     // fsub.style.cursor = 'not-allowed'
// })
