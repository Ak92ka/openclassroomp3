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
        console.log(projet)
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

    categories.forEach( categorie => {
        let btnCategorie = document.createElement("button")
        btnCategorie.dataset.categorieId = categorie.id
        btnCategorie.innerText = categorie.name
        btnCategorie.classList.add("button-filtre")
        btnCategorie.addEventListener("click", (filterProject))

        let filtre = document.querySelector(".filtre")
        filtre.appendChild(btnCategorie)
    })
    const tousButton = document.querySelector(".button-filtre")
    tousButton.classList.add("active")
    document.querySelectorAll(".button-filtre").forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.button-filtre').forEach(btn => btn.classList.remove('active'))
            this.classList.add('active')
        })
    })
}

async function filterProject(event) {
    let categoryId = event.target.dataset.categorieId

    let gallery = document.querySelector(".gallery")
    gallery.innerHTML = ''

    if (categoryId === undefined) {
        let reponse = await fetch("http://localhost:5678/api/works")
        let data = await reponse.json()

        data.forEach(projet => {
            let figure = document.createElement("figure")
            figure.dataset.categorieId = projet.categoryId

            let img = document.createElement("img")
            img.src = projet.imageUrl
            img.alt = projet.title

            let figcaption = document.createElement("figcaption")
            figcaption.textContent = projet.title

            figure.appendChild(img)
            figure.appendChild(figcaption)

            gallery.appendChild(figure)
        })
    } else {
        let reponse = await fetch("http://localhost:5678/api/works")
        let data = await reponse.json()

        data.forEach(projet => {
            if (projet.categoryId == categoryId) {
                let figure = document.createElement("figure")
                figure.dataset.categorieId = projet.categoryId

                let img = document.createElement("img")
                img.src = projet.imageUrl
                img.alt = projet.title

                let figcaption = document.createElement("figcaption")
                figcaption.textContent = projet.title

                figure.appendChild(img)
                figure.appendChild(figcaption)

                gallery.appendChild(figure)
            }
        })
    }
    }
/*Changement d'apparence de lien quand cliqué
    const lienNav = document.querySelectorAll("nav ul li")
    
    lienNav.forEach(item => {
        item.addEventListener("click", function() {
            this.classList.add("lien-clique")
            //this.classList.toggle("lien-clique")
            
        })
    })*/ 

// Authentification check
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
        }
    }

    document.addEventListener("DOMContentLoaded", checkAuthentication)