const toggleAddNewLinkDOM = document.querySelector('#add-new-link')
const toggleStyleFormDOM = document.querySelector('#profile-style-button')
const toggleStyleForm = document.querySelector('#user-style-form')
const toggleLinkForm = document.querySelector('#new-link-form')
const cancelLinkForm = document.querySelector('#cancel-form')

const toggleAddLinkFormVisibility = () => {
    if (toggleLinkForm.classList.contains('hidden')){
        toggleLinkForm.classList.remove('hidden')
        toggleLinkForm.classList.add('flex')
        toggleStyleForm.classList.add('hidden')
        toggleStyleForm.classList.remove('flex')
    } else {
        toggleLinkForm.classList.add('hidden')
        toggleLinkForm.classList.remove('flex')
    }
}

const toggleStyleFormVisibility = () => {
    if (toggleStyleForm.classList.contains('hidden')){
        toggleStyleForm.classList.remove('hidden')
        toggleStyleForm.classList.add('flex')
        toggleLinkForm.classList.add('hidden')
        toggleLinkForm.classList.remove('flex')
    } else {
        toggleStyleForm.classList.add('hidden')
        toggleStyleForm.classList.remove('flex')
    }
}

if(toggleStyleFormDOM) {
    toggleStyleFormDOM.addEventListener('click', toggleStyleFormVisibility)
}


if (toggleAddNewLinkDOM){
    toggleAddNewLinkDOM.addEventListener('click', toggleAddLinkFormVisibility)
}

if (cancelLinkForm){
    cancelLinkForm.addEventListener('click', toggleAddLinkFormVisibility)
}

const deleteLink = async (deleteButton, event) => {
    event.preventDefault()
    const number = deleteButton.getAttribute('number')

    links.forEach((link) => {
        if (link.getAttribute('number') === number){
            link.remove()
        }
    })

    const data = await fetch(`${BACKEND_URL}/deleteLink/${number}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    })

    const result = await data.json()

    if (result.message){
        toastr.success(result.message)
        const interval = setInterval(() => {
            window.location.reload()
            clearInterval(interval)
        }, 500)
    } else {
        toastr.error(result.error)
        const interval = setInterval(() => {
            window.location.href = '/login'
            clearInterval(interval)
        }, 350)
    }
}

const links = document.querySelectorAll('#link')
const deleteButtons = document.querySelectorAll('#delete')

if (deleteButtons){
    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener('click', (event) => deleteLink(deleteButton, event))
    })
}



// // drag-drop
// const list = document.querySelector('.list')
// const listItems = document.querySelectorAll('#link')


// listItems.forEach(item => {
//     const draggable = item.getAttribute('draggable')

//     if (draggable === 'true'){
//         item.addEventListener('dragstart', () => {
//             item.classList.add('dragging')
//         })

//         item.addEventListener('dragend', () => {
//         item.classList.remove('dragging')
//         })
//     }
// })

// list.addEventListener('dragover', (e) => {
//     e.preventDefault()
//     const afterElement = getDragAfterElement(list, e.clientY)
//     const dragging = document.querySelector('.dragging')
//     if (afterElement == null) {
//         list.appendChild(dragging)
//     } else {
//         list.insertBefore(dragging, afterElement)
//     }
// })

// function getDragAfterElement(container, y) {
//     const draggableElements = [...container.querySelectorAll('#link:not(.dragging)')]
//     return draggableElements.reduce((closest, child) => {
//         const box = child.getBoundingClientRect()
//         const offset = y - box.top - box.height / 2
//         if (offset < 0 && offset > closest.offset) {
//             return { offset: offset, element: child }
//         } else {
//             return closest
//         }
//     }, { offset: Number.NEGATIVE_INFINITY }).element
// }





