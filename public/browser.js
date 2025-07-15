
// add item dynamically in the client-side
function addItem(dbItem){
  return ` <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${dbItem.text}</span>
        <div>
          <button data-id = "${dbItem._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
          <button data-id = "${dbItem._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
      </li>
     `
}

// Initial page load render
let ourHtml = items.map(function(item){
  return addItem(item)
}).join("")
document.getElementById('item-list').insertAdjacentHTML("beforeend", ourHtml)

// Create feature
let createField = document.getElementById("create-field")
document.getElementById("create-form").addEventListener("submit", function(e){
    e.preventDefault(); // remove default behavior of form
  
    axios.post("/create-item", {text: createField.value})
    .then(function(req){
      console.log(req)
       document.getElementById("item-list").insertAdjacentHTML("beforeend", addItem(req.data))
       createField.value = ""
       createField.focus()
    })
    .catch(function(){
      console.log('try again later!')
    })


})



document.addEventListener("click", function (e) {

  // delete feature
  if (e.target.classList.contains("delete-me")){
    
    if(confirm("Do you want to delete it?")){
      
     

      axios.post("/delete-item", {id: e.target.getAttribute('data-id')})
      .then(function(){
        e.target.parentElement.parentElement.remove();
      })
      .catch(function(){
        console.log('try again later! ')
      })  
    }

  }


  // update feature
  if (e.target.classList.contains("edit-me")) {
    //This piece of code return boolean value
    const userInput = prompt(
      "Add your today's routine",
      e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
    );

    if (userInput) {
      // sending userInput data to the node server
      axios
        .post("/update-item", {
          text: userInput,
          id: e.target.getAttribute("data-id"),
        }) // (passed userInput data, target unique database data id using html attribute)
        .then(function () {
          e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput; // real time update data in UI side
        })
        .catch(function () {
          console.log("pls try again later!");
        });
    }
  }
});



