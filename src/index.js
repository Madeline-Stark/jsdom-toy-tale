

let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  addToyForm()
  fetchToys()
  const toyForm = document.querySelector(".add-toy-form")
  toyForm.addEventListener('submit', postToy)
});

function addToyForm(){
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
}

function fetchToys(){
  //When the page loads, 
//make a 'GET' request to fetch all the toy objects. 


  fetch("http://localhost:3000/toys")
  .then((resp) => {
    return resp.json()
  })
  .then((obj) => {  
    //obj is an array of toy objects
    for (const toy of obj){
      createToyCard(toy)
       
    }
  })

}

function createToyCard(toy){
    const toyCollection = document.getElementById("toy-collection")
  //With the response data, make a <div class="card"> for each toy and add it 
    //to the toy-collection div
    const card = document.createElement('div')
    card.classList += "card"
    //add id so can use later in patch request later
    card.id = `${toy.id}-toy`
    
    const cardHeader = document.createElement('h2')
    cardHeader.innerText += toy.name
    card.appendChild(cardHeader)

    const avatar = document.createElement('img')
    avatar.classList += "toy-avatar"
    avatar.src = toy.image 
    card.appendChild(avatar)

    const likes = document.createElement('p')
    likes.innerText += `${toy.likes} Likes`
    card.appendChild(likes)

    const likeButton = document.createElement('button')
    likeButton.classList += "like-btn"
    likeButton.innerText += "Like <3"
    likeButton.addEventListener('click', addLike)
    card.appendChild(likeButton)

    
    //add card to toy collection
    toyCollection.appendChild(card)

}

function postToy(event){
  event.preventDefault()
  const nameInput = event.target.name
  const imageInput = event.target.image
  const name = nameInput.value 
  const imgUrl = imageInput.value 
  
  const formData = {
    name: name,
    image: imgUrl,
    likes: 0
  }

  const configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  }

  fetch("http://localhost:3000/toys", configObj)
    .then((resp) => resp.json())
    .then((object) => {
      createToyCard(object)
    })
    .catch((error) => {
      console.log(error.message)
    })
    //clear form
    nameInput.value = ""
    imageInput.value = ""
    

}

function addLike(event){
  //Conditional increase to the toy's like count without reloading the page
  const likeCounter = event.target.previousElementSibling
  let likes = parseInt(likeCounter.innerText) // takes integer out of string -integer needs to be first though
  likes++ //has to be let to be able to do this
  likeCounter.innerText = `${likes} Likes`

  let toyID = parseInt(event.target.parentElement.id)

  //A patch request sent to the server at http://localhost:3000/toys/:id updating the number of likes that the specific toy has
  const likeData = {likes: likes} // can also do {likes} b/c of destructuring

  const configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(likeData)
  }

  fetch(`http://localhost:3000/toys/${toyID}`, configObj)
    .then((response) => {response.json()})
    .then((object) => {
      console.log(object)
    })
    .catch((error) => console.log(error.message))
}