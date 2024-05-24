async function travaux() {
    let reponse = await fetch("http://localhost:5678/api/works")
    let data = await reponse.json()

let gallerie = document.querySelector(".gallery")

gallerie.innerHTML = ''

for(let i = 0; i < data.length; i++){
    let figure = document.createElement("figure")
    let img = document.createElement("img")
    let figcaption = document.createElement("figcaption")

    img.src = data[i].imageUrl
    img.alt = data[i].title
    figcaption.textContent = data[i].title

    figure.appendChild(img)
    figure.appendChild(figcaption)

    gallerie.appendChild(figure)
}

}


travaux()