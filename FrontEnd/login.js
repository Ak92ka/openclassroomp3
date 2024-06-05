function loginUtilisateur() {
    const formLogin = document.querySelector(".form-login")

    formLogin.addEventListener("submit", function (event) {
        event.preventDefault()

        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        
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
                window.location.href ="/FrontEnd/index.html"
            } else {
                if(response.status === 401) {
                console.error("Non autorisé")
                const UtilisateurFaux = document.getElementById("email-faux")
                UtilisateurFaux.textContent = "Mot de passe incorrect"
                UtilisateurFaux.style.display = "block"
            } else {
                console.error("Utilisateur non-existant")
                const UtilisateurFaux = document.getElementById("email-faux")
                UtilisateurFaux.textContent = "Utilisateur non-existant"
                UtilisateurFaux.style.display = "block"
            }
        }
    })
    
})
}

loginUtilisateur()