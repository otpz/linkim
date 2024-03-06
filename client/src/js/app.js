const login = async (event) => {
    event.preventDefault()

    const data = await fetch('http://localhost:3000/login.html', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: event.target.email.value,
            password: event.target.password.value
        })
    })

    const {email, password} = await data.json()
    console.log(email, password)
    // location.href = "./profile.html";
}

const register = async (event) => {
    event.preventDefault()

    console.log(event.target.name.value,
        event.target.surname.value,
        event.target.username.value,
        event.target.email.value,
        event.target.password.value)
        
    const data = await fetch('http://localhost:3000/register.html', {
        method: 'POST',
        headers: {
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

    toastr.options.positionClass = "toast-top-center";

    if (result.error){
        toastr.error(result.error);
    } else {
        toastr.success(result.message);
    }

    // location.href = "./login.html";
}