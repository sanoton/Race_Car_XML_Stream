"use strict";

const btnCreate = document.querySelector(".show-create-modal");
const btnEditModal = document.querySelector(".show-edit-modal");
const btnDeleteModal = document.querySelector(".show-delete-modal");

const editModal = document.querySelector(".edit-modal");
const table = document.querySelector(".table");

// const btnsCloseModal = document.querySelector(".close-modal");
const overlay = document.querySelector(".overlay");

btnCreate.addEventListener("click", function(e){
    e.preventDefault();
    alert("create");

});


btnEditModal.addEventListener("click", function(e){
    e.preventDefault();
    alert("edit");

    // hide the table
    table.classList.add("hidden");
    overlay.classList.remove("hidden");
    editModal.classList.remove("hidden");
});


btnDeleteModal.addEventListener("click", function(e){
    e.preventDefault();
    alert("delete");
});


/* <div class="edit-modal hidden">
<button class="close-modal">&times;</button>
<h1>I'm a modal window 😍</h1>
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
  occaecat cupidatat non proident, sunt in culpa qui officia deserunt
  mollit anim id est laborum.
</p>
</div> */