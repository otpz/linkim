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





