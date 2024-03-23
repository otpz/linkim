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
    <div id="question-id" class="question-main">
        <div class="top">
            <div class="q-user-info">
                <img class="avatar" src="/public/assets/img/pp.jpg" alt="">
                <div class="info">
                    <span class="name">Osman Topuz</span>
                    <span class="username">@otpz</span>
                </div>
            </div>
            <div class="user-text">
                <p>Lorem. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos veritatis ducimus ipsum et sed ea nemo. Provident perferendis atque officia!</p>
            </div>
        </div>
        <div class="middle">
            <form id="question-form-id" class="form w-full .question-form" onsubmit="answerQuestion(event)" action="">
                <textarea name="answer" id="answer" rows="3" placeholder="Cevabınızı yazın..."></textarea>
                <div class="mt-1 flex w-full h-10 items-start justify-start">
                    <button type="submit" class="mr-2 hover:text-blue-500">Gönder</button>
                    <button class="ml-2 hover:text-red-500" disabled>Sil</button>
                </div>
            </form>
        </div>
    </div>
    `

    if(result){
        event.target.question.value = ""
        sendQuestion.disabled = false
        sendQuestion.innerHTML = "Gönder"
    }
    
    if (result.message){
        toastr.success(result.message)
        // const questionsDOM = document.getElementById("questions")
        // questionsDOM.innerHTML += newQuestion
    } else if (result.errorValidation){
        result.errorValidation.forEach(element => {
            toastr.error(element)
        })
    } else if (result.error){
        toastr.error(result.error)
    } else if(result.errorRequest){
        toastr.error(result.errorRequest)
    }

}

const answerQuestion = async (event) => {
    event.preventDefault()

    // kullanıcı adını alma
    const currentUrl = window.location.href
    const usernameWithAt = currentUrl.split('@')[1]
    const username = usernameWithAt.split('&')[0]

    const data = await fetch(`${BACKEND_URL}/answer/${username}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            answer: event.target.answer.value,
            question_id: event.target.question_id.value
        })
    })

    const result = await data.json()

    if (result.message){
        toastr.success(result.message)
    } else if (result.errorValidation){
        result.errorValidation.forEach(element => {
            toastr.error(element)
        })
    } else if (result.error){
        toastr.error(result.error)
    } else if(result.errorRequest){
        toastr.error(result.errorRequest)
    }

}

const deleteQuestion = async (event) => {
    event.preventDefault()

    const data = await fetch(`${BACKEND_URL}/deletequestion/${event.target.id}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    })

    const result = await data.json()

    console.log(" delete question result - app.js", result)

    if (result.message){
        toastr.success(result.message)
    } else {
        toastr.error(result.error)
    }
    
}

