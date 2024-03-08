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
        toastr.success(result.message)
        const redirectInterval = setInterval(() => {
            window.location.href = `./profile/${result.userName}`
            clearInterval(redirectInterval)
        }, 500)
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
        toastr.error(result.error);
    } else {
        toastr.success(result.message);
        const redirectInterval = setInterval(() => {
            window.location.href = `./login`
            clearInterval(redirectInterval)
        }, 500)
    }

    // location.href = "./login.html";
}