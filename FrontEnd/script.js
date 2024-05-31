getTravaux()
getCategoriesFiltre()

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

async function getCategoriesFiltre() {
    let reponse = await fetch("http://localhost:5678/api/categories")
    let categories = await reponse.json()
    let boutonFiltre = document.querySelector(".filtre button")
    boutonFiltre.addEventListener("click", (filterProject))

    categories.forEach( categorie => {
        let btnCategorie = document.createElement("button")
        btnCategorie.dataset.categorieId = categorie.id
        btnCategorie.innerText = categorie.name
        btnCategorie.addEventListener("click", (filterProject))
        
        let filtre = document.querySelector(".filtre")
        filtre.appendChild(btnCategorie)

    })
}

function filterProject(event) {
    let categoryId = event.target.dataset.categorieId;

    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = '';

    if (categoryId === undefined) {
        fetch("http://localhost:5678/api/works")
            .then(response => response.json())
            .then(data => {
                data.forEach(projet => {
                    let figure = document.createElement("figure");
                    figure.dataset.categorieId = projet.categoryId;

                    let img = document.createElement("img");
                    img.src = projet.imageUrl;
                    img.alt = projet.title;

                    let figcaption = document.createElement("figcaption");
                    figcaption.textContent = projet.title;

                    figure.appendChild(img);
                    figure.appendChild(figcaption);

                    gallery.appendChild(figure);
                });
            })

        } else {
            fetch("http://localhost:5678/api/works")
            .then(response => response.json())
            .then(data => {
                data.forEach(projet => {
                    if (projet.categoryId == categoryId) {
                        let figure = document.createElement("figure");
                        figure.dataset.categorieId = projet.categoryId;

                        let img = document.createElement("img");
                        img.src = projet.imageUrl;
                        img.alt = projet.title;

                        let figcaption = document.createElement("figcaption");
                        figcaption.textContent = projet.title;

                        figure.appendChild(img);
                        figure.appendChild(figcaption);

                        gallery.appendChild(figure);
                    }
                });
            })
    }
}


