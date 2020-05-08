let addToy = false;


document.addEventListener("DOMContentLoaded", () => {
  
  addEventListeners()

});

function addEventListeners(){
  addToyForm()
  fetchToys()
  const toyForm = document.querySelector(".add-toy-form")
  toyForm.addEventListener('submit', postToy)
}

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
  //post requests require 2nd argument to fetch, get does not

  fetch('http://localhost:3000/toys')
  .then((resp) => {
    return resp.json()
  })
  .then((json) => {
    //json is object, use for...in
    for (key in json){
      const toy = json[key] //defining explainer variables good, make sure to name well
      createToyCard(toy)
      
    }
  })

}

function createToyCard(toy){
  const toyCollection = document.getElementById("toy-collection")
  //WHERE IS BEST PLACE TO DEFINE ABOVE?
  const card = document.createElement('div') //just card, not cardDiv - superfluous
  card.classList += "card"

  const cardHeader = document.createElement('h2')
  cardHeader.innerText += toy.name
  card.appendChild(cardHeader)

  const avatar = document.createElement('img')
  avatar.src = toy.image
  avatar.classList += "toy-avatar"
  card.appendChild(avatar)

  const likes = document.createElement('p')
  likes.innerText += `${toy.likes} Likes`
  card.appendChild(likes)

  const likeButton = document.createElement('button')
  likeButton.classList += "like-button"
  likeButton.innerText += "Like"
  likeButton.addEventListener('click', addLikes)
  card.appendChild(likeButton)

  toyCollection.appendChild(card)

}

function postToy(event){
  event.preventDefault()
  //create object out of user input
  const name = event.target.elements[0].value
  const img = event.target.elements[1].value
  const newToy = {name: name, image: img, likes: 0}
  
  //post fetch request with objects
  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(newToy)
  }

  fetch("http://localhost:3000/toys", configObj)
    .then((resp) => resp.json())
    .then((object) => {
      createToyCard(object)
    })
    .catch((error) => {
      console.log(error.message)
    })

}

function addLikes(event) {
  console.log('liked')
}

const dummylink = "https://www.freeiconspng.com/uploads/slinky-png-transparent-1.png"