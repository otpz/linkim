const toggleAddNewLinkDOM = document.querySelector('#add-new-link')
const toggleForm = document.querySelector('#new-link-form')
const cancelForm = document.querySelector('#cancel-form')

const toggleFormVisibility = () => {
    if (toggleForm.classList.contains('hidden')){
        toggleForm.classList.remove('hidden')
        toggleForm.classList.remove('opacity-0')
        toggleForm.classList.add('flex')
        toggleForm.classList.add('opacity-100')
    } else {
        toggleForm.classList.add('hidden')
        toggleForm.classList.remove('flex')
        toggleForm.classList.remove('opacity-100')
        toggleForm.classList.add('opacity-0')
    }
}

if (toggleAddNewLinkDOM){
    toggleAddNewLinkDOM.addEventListener('click', toggleFormVisibility)
}

if (cancelForm){
    cancelForm.addEventListener('click', toggleFormVisibility)
}

