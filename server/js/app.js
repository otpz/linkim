const BACKEND_URL = 'http://localhost:3000'

const login = async (event) => {
    event.preventDefault()

    const loginSubmit = document.getElementById("loginSubmit")
    loginSubmit.disabled = true
    loginSubmit.innerHTML = "Giriş yapılıyor.."
   
    const data = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: event.target.email.value,
            password: event.target.password.value
        })
    })
    
    const result = await data.json()

    toastr.options.positionClass = "toast-top-center"

    if(!result.message){
        loginSubmit.disabled = false
        loginSubmit.innerHTML = "Giriş Yap"
    }

    if (result.undefined){
        toastr.error(result.undefined)
    } else if (result.passwordError){
        toastr.error(result.passwordError)
    } else if (result.authError){
        toastr.error(result.authError)
    } else if (result.message){
        event.target.email.value = ''
        event.target.password.value = ''
        toastr.success(result.message)
        setTimeout(() => {
            window.location.href = `/@${result.userName}`
        }, 1000)
    } else if (result.errorValidation){
        result.errorValidation.forEach(element => {
            toastr.error(element)
        })
    } else {
        toastr.error(result.error)
    }
}

const register = async (event) => {
    event.preventDefault()  

    const registerSubmit = document.getElementById("registerSubmit")
    registerSubmit.disabled = true
    registerSubmit.innerHTML = "Kayıt gerçekleştiriliyor.."

    const data = await fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: event.target.name.value,
            surname: event.target.surname.value,
            username: event.target.username.value,
            email: event.target.email.value,
            password: event.target.password.value,
            g_rechaptcha_response: event.target['g-recaptcha-response'].value
        })
    })

    const result = await data.json()

    if (!result.message){
        registerSubmit.disabled = false
        registerSubmit.innerHTML = "Kayıt Ol"
        grecaptcha.reset()
    }

    if (result.errorValidation){
        result.errorValidation.forEach(element => {
            toastr.error(element)
        })
    } else if (result.errorSql){ 
        toastr.error(result.errorSql)
    } else if (result.error){
        toastr.error(result.error)  
    } else {
        event.target.name.value = ''
        event.target.surname.value = ''
        event.target.username.value = ''
        event.target.email.value = ''
        event.target.password.value = ''
        toastr.success(result.message)
        setTimeout(() => {
            window.location.href = `./login`
        }, 500)
    }
}

const logout = async () => {
    const data = await fetch(`${BACKEND_URL}/logout`, {
        method: 'GET'
    })

    const result = await data.json()

    if (result.message){
        toastr.success(result.message)
    } else {
        toastr.error("Bir hata oluştu.")
    }
}

const setProfileInfo = async (event) => {

    event.preventDefault()

    const settingsSubmit = document.getElementById("settingsSubmit")
    settingsSubmit.disabled = true
    settingsSubmit.innerHTML = "Kaydediliyor.."

    const data = await fetch(`${BACKEND_URL}/settings`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: event.target.name.value,
            surname: event.target.surname.value,
            username: event.target.username.value,
            biography: event.target.biography.value,
            email: event.target.email.value,
        })
    })

    const result = await data.json()

    if (!result.message){
        settingsSubmit.disabled = false
        settingsSubmit.innerHTML = "Kaydet"
    }

    if (result.message){
        event.target.name.value = ''
        event.target.surname.value = ''
        event.target.username.value = ''
        event.target.biography.value = ''
        event.target.email.value = ''
        toastr.success(result.message)
        setTimeout(() => {
            window.location.href = `/@${result.username}`
        }, 1000)

    } else if (result.emailError){
        toastr.error(result.emailError)
    } else if (result.userNameError){
        toastr.error(result.userNameError)
    } else if (result.errorValidation){
        result.errorValidation.forEach(element => {
            toastr.error(element)
        })
    } else if (result.errorSql){
        toastr.error(result.errorSql)
    } else{
        toastr.error(result.error)
        setTimeout(() => {
            window.location.href = "/login"
        }, 350)
    }
}

const addLink = async (event) => {
    event.preventDefault()

    const linkSubmit = document.getElementById("linkSubmit")
    linkSubmit.disabled = true
    linkSubmit.innerHTML = "Ekleniyor.."

    const data = await fetch(`${BACKEND_URL}/addLink`, {
        method: 'POST',
        headers: {
            'csrf-token': event.target.csrfToken.value,
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: event.target.title.value,
            link: event.target.url.value,
        })
    })

    const result = await data.json()

    if (!result.message){
        linkSubmit.disabled = false
        linkSubmit.innerHTML = "Gönder"
    }

    if (result.error){
        toastr.error(result.error)
        setTimeout(() => {
            window.location.href = "/login"
        }, 350)
    }
    else if (result.errorRequest){
        toastr.error(result.errorRequest)
    } else if (result.errorValidation){
        result.errorValidation.forEach(element => {
            toastr.error(element)
        })
    }else {
        event.target.title.value = ''
        event.target.url.value = ''
        toastr.success(result.message)
        setTimeout(() => {
            window.location.reload()
        }, 500)
    }
}

const changeStyle = async (event) => {
    event.preventDefault()

    console.log(event.target.bgColor.value)
    console.log(event.target.borderStyle.value)
    console.log(event.target.linkColor.value)

    const data = await fetch(`${BACKEND_URL}/changestyle`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bgColor: event.target.bgColor.value,
            borderStyle: event.target.borderStyle.value,
            linkColor: event.target.linkColor.value
        })
    })

    const result = await data.json()
    console.log(result)
}

const resetPassword = async (event) => {

    event.preventDefault()

    const passwordResetSubmit = document.getElementById("passwordResetSubmit")
    passwordResetSubmit.disabled = true
    passwordResetSubmit.innerHTML = "Kaydediliyor.."

    const data = await fetch(`${BACKEND_URL}/settings/resetpassword`, {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            currentPassword: event.target.currentPassword.value,
            password: event.target.password.value,
            confirmPassword: event.target.confirmPassword.value,
        })
    })

    const result = await data.json()

    if (!result.message){
        passwordResetSubmit.disabled = false
        passwordResetSubmit.innerHTML = "Şifre Değiştir"
    }

    if (result.message){
        toastr.success(result.message)
        event.target.currentPassword.value = ""
        event.target.password.value = ""
        event.target.confirmPassword.value = ""
        setTimeout(() => {
            window.location.reload()
        }, 500)
    } else if (result.passwordError){
        toastr.error(result.passwordError)
    } else if (result.passwordMatchError){
        toastr.error(result.passwordMatchError)
    } else if (result.errorSql){
        toastr.error(result.errorSql)
    } else if (result.errorValidation){
        result.errorValidation.forEach(element => {
            toastr.error(element)
        })
    } else{
        toastr.error(result.error)
        setTimeout(() => {
            window.location.href = "/login"
        }, 350)
    }

}

const resetForgotPassword = async (event) => {
    event.preventDefault()

    const passwordResetSubmit = document.getElementById("reset-forgot-password-button")
    passwordResetSubmit.disabled = true
    passwordResetSubmit.innerHTML = "Kaydediliyor.."

    const data = await fetch(`${BACKEND_URL}/resetforgotpassword`, {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: event.target.email.value,
            password: event.target.password.value,
            confirmPassword: event.target.confirmPassword.value,
        })
    })

    const result = await data.json()

    if (!result.message){
        passwordResetSubmit.disabled = false
        passwordResetSubmit.innerHTML = "Şifre Yenile"
    }

    if (result.message){
        toastr.success(result.message)
        event.target.password.value = ""
        event.target.confirmPassword.value = ""
        setTimeout(() => {
            window.location.href = "/login"
        }, 500)
    } else if (result.passwordError){
        toastr.error(result.passwordError)
    } else if (result.passwordMatchError){
        toastr.error(result.passwordMatchError)
    } else if (result.errorSql){
        toastr.error(result.errorSql)
    } else if (result.errorValidation){
        result.errorValidation.forEach(element => {
            toastr.error(element)
        })
    } else{
        toastr.error(result.error)
        setTimeout(() => {
            window.location.href = "/login"
        }, 350)
    }
}

const support = async (event) => {
    event.preventDefault()

    const data = await fetch(`${BACKEND_URL}/support`,{
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: event.target.name.value,
            email: event.target.email.value,
            question: event.target.question.value,
            g_rechaptcha_response: event.target['g-recaptcha-response'].value
        }) 
    })

    const result = await data.json();

    if (result.message){
        event.target.question.value = ''
        toastr.success(result.message)
    } else{
        toastr.error(result.error)
    }
}

const sendMail = async (event) => {
    event.preventDefault()
    
    const data = await fetch(`${BACKEND_URL}/sendmail`, {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: event.target.email.value
        })
    })

    const result = await data.json()

    if (result.errorValidation){
        result.errorValidation.forEach(element => {
            toastr.error(element)
        })
    } else if (result.message){
        toastr.success(result.message)
    }
}

const askQuestion = async (event) => {
    event.preventDefault()

    const sendQuestion = document.getElementById("sendQuestion")
    sendQuestion.disabled = true
    sendQuestion.innerHTML = "Gönderiliyor.."

    // kullanıcı adını alma
    const currentUrl = window.location.href
    const usernameWithAt = currentUrl.split('@')[1]
    const username = usernameWithAt.split('&')[0]

    const data = await fetch(`${BACKEND_URL}/ask/${username}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            question: event.target.question.value,
            anonymously: event.target.anonymously.checked,
        })
    })

    const result = await data.json()

    const newQuestion = `
        <div class="question-main">
            <div class="top">
                <div class="q-user-info">
                    <img class="avatar" src="/public/assets/img/avatar.png" alt="">
                    <div class="info">
                        <span class="name">Anonim</span>
                        <span class="username"></span>
                    </div>
                </div>
                <div class="user-text">
                    <p>Lorem. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos veritatis ducimus ipsum et sed ea nemo. Provident perferendis atque officia!</p>
                </div>
            </div>
            <div class="bottom">
                <div class="q-user-info">
                    <img class="avatar" src="/public/assets/img/pp.jpg" alt="">
                    <div class="info">
                        <span class="name">Osman Topuz</span>
                        <span class="username">@otpz</span>
                    </div>
                </div>
                <div class="user-text">
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam cum eum reprehenderit dicta sint velit earum autem inventore nesciunt itaque!</p>
                </div>
                <div class="question-stats">
                    <button class="likes">
                        <svg class="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                        <span>3 likes</span>
                    </button>
                    <div class="time">
                        <span>3 hours ago</span>
                    </div>
                </div>
            </div>
        </div>
    `
    if(!result.message){
        event.target.question.value = ""
        sendQuestion.disabled = false
        sendQuestion.innerHTML = "Gönder"
    }
    
    if (result.message){
        toastr.success(result.message)
        const questionsDOM = document.getElementById("questions")
        const newQuestionDiv = document.createElement('div')
        newQuestionDiv.innerHTML = newQuestion
        questionsDOM.appendChild(newQuestionDiv)
    } else if (result.errorValidation){
        result.errorValidation.forEach(element => {
            toastr.error(element)
        })
    } else if (result.error){
        toastr.error(result.error)
    }

}




