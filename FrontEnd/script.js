getTravaux()
getCategoriesFiltre()
checkAuthentication()
getEditionDiv()

// Récupération des travaux depuis le back-end
async function getTravaux() {
    let reponse = await fetch("http://localhost:5678/api/works")
    let data = await reponse.json()

    let galerie = document.querySelector(".gallery")

    data.forEach( projet => {
        let figure = document.createElement("figure")
        figure.dataset.categorieId = projet.categoryId
        figure.dataset.photoId = projet.id
        let img = document.createElement("img")
        let figcaption = document.createElement("figcaption")

        img.src = projet.imageUrl
        img.alt = projet.title
        figcaption.textContent = projet.title

        figure.appendChild(img)
        figure.appendChild(figcaption)

        galerie.appendChild(figure)
    })
}

// Réalisation du filtre des travaux
async function getCategoriesFiltre() {
    if(!localStorage.token) {
        let reponse = await fetch("http://localhost:5678/api/categories")
        let categories = await reponse.json()
        
        let boutonFiltre = document.querySelector(".filtre button")
        boutonFiltre.addEventListener("click", (filterProject))
        boutonFiltre.classList.add("active")
    
        categories.forEach( categorie => {
            let btnCategorie = document.createElement("button")
            btnCategorie.dataset.categorieId = categorie.id
            btnCategorie.innerText = categorie.name
            btnCategorie.classList.add("button-filtre")
            btnCategorie.addEventListener("click", (filterProject))
    
            let filtre = document.querySelector(".filtre")
            filtre.appendChild(btnCategorie)
        })
    }
}

async function filterProject(event) {
    let categoryId = event.target.dataset.categorieId

    document.querySelectorAll(".gallery figure").forEach(figure => {
        if(categoryId == "") {
            figure.style.display = "block"
        } else {
            if(categoryId == figure.dataset.categorieId) {
                figure.style.display = "block"
            } else {
                figure.style.display = "none"
            }    
        }
    })

// Couleur de boutons
    document.querySelectorAll(".button-filtre").forEach(button => {
        button.classList.remove("active")
    })
    event.target.classList.add("active")
} 

// Authentification Check
function checkAuthentication() {
    const token = localStorage.getItem("token")
    const loginLink = document.querySelector('nav ul li:nth-child(3) a')

    if (token) {
        loginLink.innerText = "logout"
        loginLink.href = "#"
        loginLink.addEventListener("click", function() {
            localStorage.removeItem("token")
            window.location.href = "./index.html"
        })
        showElements()
        filtreDisparaitre()
    }
}

// Afficher l'icone modifier après l'authentification
function showElements() {
    const boutonModifier = document.querySelectorAll(".js-modal")

    boutonModifier.forEach(e => {
        e.classList.remove("hidden")
    })
}

// Disparaition de filtre apres l'authentification
function filtreDisparaitre() {
    const filtreGallerie = document.querySelector(".filtre")
    filtreGallerie.remove()

    const outerContainer = document.querySelector(".outer-container")
    outerContainer.style.paddingBottom = "30px"
}

// La Modale
let modalGallery = null

const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute("href"))
    target.style.display = null
    modalGallery = target
    modalGallery.addEventListener("click", closeModalGallery)
    modalGallery.querySelector(".js-modal-close").addEventListener("click", closeModalGallery)
    modalGallery.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)    
    getTravauxModale()
}

const closeModalGallery = function (e) {
    if(modalGallery === null) return
    modalGallery.style.display = "none"
    modalGallery.removeEventListener("click", closeModalGallery)
    modalGallery.querySelector(".js-modal-close").removeEventListener("click", closeModalGallery)
    modalGallery.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    modalGallery = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
})

window.addEventListener("keydown", function (e) {
    if(e.key === "Escape" || e.key === "Esc") {
        closeModalGallery(e)
    }
})

//récuperation des gallerie dans la modale
async function getTravauxModale() {
    let reponse = await fetch("http://localhost:5678/api/works")
    let data = await reponse.json()

    let gallerieModale = document.querySelector(".gallery-modale")

    gallerieModale.innerHTML = ""

    const token = localStorage.getItem("token")

    data.forEach( projet => {
        let figure = document.createElement("figure")
        figure.dataset.categorieId = projet.categoryId
        figure.dataset.photoId = projet.id
        
        let img = document.createElement("img")
        img.src = projet.imageUrl
        img.alt = projet.title

        figure.appendChild(img)

        let corbeilleIcone = document.createElement("i")
        corbeilleIcone.classList.add("fa-solid", "fa-trash-can")

        figure.appendChild(corbeilleIcone)
        gallerieModale.appendChild(figure)

// Suppression de la galerie dans la modale
        corbeilleIcone.addEventListener("click", async function(event) {
            event.preventDefault()
    
            try {
                let deleteReponse = await fetch(`http://localhost:5678/api/works/${projet.id}` , {
                    method: 'DELETE',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "accept": "**" 
                  } 
                })
    
                if(deleteReponse.ok) {
                    figure.remove()
                    const mainFigure = document.querySelector(`.gallery figure[data-categorie-id="${projet.categoryId}"][data-photo-id="${projet.id}"]`);
                    if (mainFigure) {
                        mainFigure.remove()
                    }
                } else if (deleteReponse.status === 403) {
                    console.error("Interdit : Vous n'êtes pas autorisé à supprimer cet élément");
                } else {
                    console.error("Échec de la suppression de l'image sur le serveur");
                }
             } catch (error) {
                    console.error("erreur de supprimer l'image", error)
                }
            })
        })
}

// Ajout photo modal
let modalAjouterPhoto = null

document.addEventListener("DOMContentLoaded", function() {
    const ajouterPhotoButton = document.querySelector(".modal-bouton")

    ajouterPhotoButton.addEventListener("click", function(e) {
        e.preventDefault()
        const secondModal = document.getElementById("modal-ajouter-photo")
        if (secondModal) {
            closeModalGallery()
            secondModal.style.display = null
            modalAjouterPhoto = secondModal
            modalAjouterPhoto.addEventListener("click", closeModalAjouterPhoto)
            modalAjouterPhoto.querySelectorAll(".js-modal-close, .js-modal-return").forEach(element => {
                element.addEventListener("click", closeModalAjouterPhoto)
            })
            modalAjouterPhoto.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
        }
    })
    

    function stopPropagation(e) {
        e.stopPropagation()
    }

    window.addEventListener("keydown", function(e) {
        if (e.key === "Escape" || e.key === "Esc") {
            closeModalAjouterPhoto(e)
        }
    })


})

function closeModalAjouterPhoto(e) {
    if (modalAjouterPhoto === null) return
    modalAjouterPhoto.style.display = "none"
    modalAjouterPhoto.removeEventListener("click", closeModalAjouterPhoto)
    modalAjouterPhoto.querySelectorAll(".js-modal-close, .js-modal-return").forEach(element => {
        element.removeEventListener("click", closeModalAjouterPhoto)
    })
    modalAjouterPhoto.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    modalAjouterPhoto = null
}

// Fonctionalité d'ajouter une photo
const ajouterPhotoButton = document.querySelector(".button-ajouter-photo")
const fileInput = document.getElementById("photo")
const form = document.getElementById("upload-photo-form")
const validerButton = document.querySelector(".modal-valider")
const modal = document.getElementById("modal-ajouter-photo")
const photoGallery = document.getElementById("photo-gallery")

ajouterPhotoButton.addEventListener("click", function() {
    fileInput.click()
})

fileInput.addEventListener("change", function(event) {
    displayImage(event)
    updateValiderButtonState()
})

form.addEventListener("input", function() {
    updateValiderButtonState()
})

form.addEventListener("submit", async function(event) {
    event.preventDefault()
        
    const title = document.getElementById("titre").value.trim()
    const categorie = document.getElementById("categorie").value
    const image = document.getElementById("photo").files[0]
    
//regex ajout photo
    if (!title) {
        const titreError = document.getElementById("titre-error")
        titreError.style.display = "block"
        validerButton.disabled = true
    } 
    else {   
        const titreError = document.getElementById("titre-error")
        titreError.style.display = "none"
        validerButton.removeAttribute("disabled")     
    }
    document.getElementById("titre").addEventListener("keyup", function() {
        const titreError = document.getElementById("titre-error")
        titreError.style.display = "none"       
    })
        
    if (!categorie) {
    const categoryError = document.getElementById("category-error")
    categoryError.style.display = "block"
    validerButton.disabled = true
}
    document.getElementById("categorie").addEventListener("change", function() {
        const categoryError = document.getElementById("category-error")
        categoryError.style.display = "none"
        validerButton.removeAttribute("disabled")
})
    if (!image) {
        const imageError = document.getElementById("image-error")
        const imageErrorCss = document.querySelector(".image-error")
        imageError.style.display = "block"
        imageErrorCss.style.display = "block"
        form.disabled = true
        return
    } 
    if (image) {
    document.getElementById("photo").addEventListener("change", function() {
        const imageError = document.getElementById("image-error")
        const imageErrorCss = document.querySelector(".image-error")
        imageError.style.display = "none"
        imageErrorCss.style.display = "none"
        
    })
    }
    if(!title && !categorie) {
        const titreError = document.getElementById("titre-error")
        titreError.style.display = "block"
        validerButton.type = "button"
        const categoryError = document.getElementById("category-error")
        categoryError.style.display = "block"
        validerButton.type = "button"
        return
    }
//

const formData = new FormData()
formData.append("title", title)
formData.append("category", categorie)
formData.append("image", image)
const token = localStorage.getItem("token")
console.log(token)
    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: formData
        })

        if (response.ok) {
            const result = await response.json()
            console.log("Photo uploaded successfully:", result)
            form.reset()
            const imgElement = document.querySelector("#target-image img")
            imgElement.src = ""
            const targetImageDiv = document.getElementById("target-image")
            targetImageDiv.style.display = "none"
            const ajoutPhotoContainer = document.querySelector(".ajout-photo-container")
            ajoutPhotoContainer.style.display = "flex"
            const newFigureMain = createPhotoFigure(result)
            document.querySelector(".gallery").append(newFigureMain)
            closeModalAjouterPhoto()
            closeModalGallery()
        } else {
            console.error("Failed to upload photo:", response.statusText)
        }
    } catch (error) {
        console.error("Error during photo upload:", error)
    }
})

function createPhotoFigure(photoData, isModal = false) {
    const figure = document.createElement("figure");
    figure.dataset.categorieId = photoData.categoryId;
    figure.dataset.photoId = photoData.id

    const img = document.createElement("img");
    img.src = photoData.imageUrl;
    img.alt = photoData.title;


    let figcaption = document.createElement("figcaption")

    figcaption.textContent = photoData.title

    figure.appendChild(img)
    figure.appendChild(figcaption)

    return figure
}

function displayImage(event) {
    const file = event.target.files[0]

    document.querySelector('.ajout-photo-container').style.display = "none"
    document.getElementById('target-image').style.display = "flex"
    const reader = new FileReader()
    reader.onload = function(e) {
        document.querySelector('#target-image img').src = e.target.result
}
reader.readAsDataURL(file)
}



//// Fonctionalités Supplémentaires ///

//form & photo reset 
document.querySelectorAll(".js-modal-close").forEach(e => {
    e.addEventListener("click", function() {
        form.reset()

        const imgElement = document.querySelector("#target-image img")
        imgElement.src = ""
        const targetImageDiv = document.getElementById("target-image")
        targetImageDiv.style.display = "none"
        const ajoutPhotoContainer = document.querySelector(".ajout-photo-container")
        ajoutPhotoContainer.style.display = "flex"    
    })
})

document.querySelector(".js-modal-return").addEventListener("click", function() {
        form.reset()

        const imgElement = document.querySelector("#target-image img")
        imgElement.src = ""
        const targetImageDiv = document.getElementById("target-image")
        targetImageDiv.style.display = "none"
        const ajoutPhotoContainer = document.querySelector(".ajout-photo-container")
        ajoutPhotoContainer.style.display = "flex"    
    })

function updateValiderButtonState() {
    if (checkInputsCompleted()) {
        validerButton.classList.add("green-button")
    } else {
        validerButton.classList.remove("green-button")
    }
}

// Changement de couleur de valider bouton
function checkInputsCompleted() {
    const titreInput = document.getElementById("titre").value.trim()
    const categorieInput = document.getElementById("categorie").value.trim()
    const fileSelected = fileInput.files.length > 0

    return titreInput !== "" && categorieInput !== "" && fileSelected
}

//Changement d'apparence de lien quand cliqué
const navLinks = document.querySelectorAll("nav li")
const currentPage = window.location.pathname

navLinks.forEach(li => {
    const anchor = li.querySelector("a")
    if(anchor) {
    const linkHref = anchor.getAttribute("href")
    const linkPath = new URL(linkHref, window.location.origin).pathname
    if (linkPath === currentPage) {
        li.classList.add("lien-clique")
    }
}
    li.addEventListener("click", function() {
        navLinks.forEach(link => {
            link.classList.remove("lien-clique")
        })

        li.classList.add("lien-clique")
        
    })
})

//mode édition apparaître
function getEditionDiv() {
    const token = localStorage.getItem("token")
    const editionDiv = document.querySelector(".mode-edition")
    const header = document.querySelector("header")

    if(token) {
        editionDiv.style.display = "block"   
        header.style.margin = "80px 0" 
    }
}