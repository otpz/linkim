const BACKEND_URL = 'http://localhost:3000'

const login = async (event) => {
    event.preventDefault()

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

    console.log("result", result)
    toastr.options.positionClass = "toast-top-center"

    if (result.undefined){
        toastr.error(result.undefined)
    } else if (result.passwordError){
        toastr.error(result.passwordError)
    } else if (result.authError){
        toastr.error(result.authError)
    } else{
        console.log("redirected:", result.userName)
        toastr.success(result.message)
        const redirectInterval = setInterval(() => {
            window.location.href = `/@${result.userName}`
            clearInterval(redirectInterval)
        }, 1500)
    }
}

const register = async (event) => {
    event.preventDefault()
        
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
            password: event.target.password.value
        })
    })

    const result = await data.json()

    if (result.error){
        result.error.forEach(element => {
            toastr.error(element)
        })
    } else if (result.errorSql){ 
        toastr.error(result.errorSql)
    } else {
        toastr.success(result.message);
        const redirectInterval = setInterval(() => {
            window.location.href = `./login`
            clearInterval(redirectInterval)
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

    if (result.message){
        toastr.success(result.message)
        const interval = setInterval(() => {
            window.location.href = `/@${result.username}`
            clearInterval(interval)
        }, 1000)

    } else if (result.emailError){
        toastr.error(result.emailError)
    } else if (result.userNameError){
        toastr.error(result.userNameError)
    } else if (result.error){
        result.error.forEach(element => {
            toastr.error(element)
        })
    } else if (result.errorSql){
        toastr.error(result.errorSql)
    }
}

const addLink = async (event) => {

    event.preventDefault()

    const data = await fetch(`${BACKEND_URL}/addLink`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: event.target.title.value,
            link: event.target.url.value,
        })
    })

    const result = await data.json()

    if (result.error){
        toastr.error(result.error)
    } else if (result.urlError){
        toastr.error(result.urlError)
    } else {
        toastr.success(result.message)
        event.target.title.value = ""
        event.target.title.value = ""
        const interval = setInterval(() => {
            window.location.reload()
            clearInterval(interval)
        }, 500)
    }
}

const resetPassword = async (event) => {

    event.preventDefault()

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

    console.log("result -> ", result)

    if (result.message){
        toastr.success(result.message)
        event.target.currentPassword.value = ""
        event.target.password.value = ""
        event.target.confirmPassword.value = ""

        const interval = setInterval(() => {
            window.location.reload()
            clearInterval(interval)
        }, 500)
        
    } else if (result.passwordError){
        toastr.error(result.passwordError)
    } else if (result.passwordMatchError){
        toastr.error(result.passwordMatchError)
    } else if (result.errorSql){
        toastr.error(result.errorSql)
    } else {
        result.error.forEach(element => {
            toastr.error(element)
        })
    }

}