loginUtilisateur()

// Authentification de l’utilisateur
function loginUtilisateur() {
    const errorDiv = document.getElementById("email-faux")

    document.querySelector(".button-connexion").addEventListener("click", function (event) {
        event.preventDefault()

        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        if(!email) {
            errorDiv.innerText = "Merci de renseigner votre email"
            return
        }         
        if(!password) {
            errorDiv.innerText = "Merci de renseigner votre mot de passe"
            return
        }

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response=> {
            if(response.ok) {
                return response.json()
            }
        })
        .then(data => {
            if(data.token) {
                localStorage.setItem("token", data.token)
                window.location.href ="/FrontEnd/index.html"
            }
        })
        .catch(error => {
            console.error("Erreur:", error)
        })
    })
}


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



