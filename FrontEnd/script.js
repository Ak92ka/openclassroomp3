getTravaux()
getCategoriesFiltre()

// Récupération des travaux depuis le back-end
async function getTravaux() {
    let reponse = await fetch("http://localhost:5678/api/works")
    let data = await reponse.json()

    let gallerie = document.querySelector(".gallery")

    data.forEach( projet => {
        let figure = document.createElement("figure")
        figure.dataset.categorieId = projet.categoryId
        let img = document.createElement("img")
        let figcaption = document.createElement("figcaption")

        img.src = projet.imageUrl
        img.alt = projet.title
        figcaption.textContent = projet.title

        figure.appendChild(img)
        figure.appendChild(figcaption)

        gallerie.appendChild(figure)
    })
}

// Réalisation du filtre des travaux
async function getCategoriesFiltre() {
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

// Afficher l'icone modifier après l'authentification
document.addEventListener("DOMContentLoaded", function() {
    const boutonModifier = document.querySelectorAll(".js-modal")

function showElements() {
    boutonModifier.forEach(e => {
        e.classList.remove("hidden")
    })
}

// Authentification Check
function checkAuthentication() {
    const token = localStorage.getItem("token")
    const loginLink = document.querySelector('nav ul li a[href="/FrontEnd/login.html"]')

    if (token) {
        loginLink.textContent = "logout"
        loginLink.href = "#"
        loginLink.addEventListener("click", function() {
            localStorage.removeItem("token")
            window.location.href = "/FrontEnd/index.html"
        })
        showElements()
    }
}

checkAuthentication()

})

// La Modale
let modal = null

const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"))
    target.style.display = null
    modal = target
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)    
}

const closeModal = function (e) {
    e.preventDefault();
    if(modal === null) return
    modal.style.display = "none"
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
})

window.addEventListener("keydown", function (e) {
    if(e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})





    /*Changement d'apparence de lien quand cliqué
    const lienNav = document.querySelectorAll("nav ul li")
    
    lienNav.forEach(item => {
        item.addEventListener("click", function() {
            this.classList.add("lien-clique")
            //this.classList.toggle("lien-clique")
            
        })
    })*/