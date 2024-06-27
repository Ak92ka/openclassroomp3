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
            } else {
                errorDiv.innerText = "Erreur dans l’identifiant ou le mot de passe"
                return
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

// Regex login
document.addEventListener("DOMContentLoaded", function() {
    const inputEmail = document.getElementById("email")
    const inputPassword = document.getElementById("password")
    
    const emailError = document.getElementById("email-error")
    const passwordError = document.getElementById("password-error")

    const emailNonExistant = document.querySelector(".email-faux")
    
    const patterns = {
        email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
        password: /^[\w@-]{6,20}$/
    }
    
    function validate(field, regex, errorElement) {
        if(regex.test(field.value)) {
            errorElement.style.display = "none"
            emailNonExistant.style.display = "block"
        } else {
            errorElement.style.display = "block"
            emailNonExistant.style.display = "none"
        }
    }
        
    inputEmail.addEventListener("keyup", (e) => {
        validate(e.target, patterns.email, emailError)
    })
    
    inputPassword.addEventListener("keyup", (e) => {
        validate(e.target, patterns.password, passwordError)
    })
    })

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