"use strict";



// The array of records. 
let records = [];
let now = new Date();
let locale = "zh-TW";


const options = {
    hour: "numeric",
    minute: "numeric", 
    day: "numeric", 
    month: "long", 
    year: "numeric", 
};

const record1 = {
    name: "Steven", 
    id: "#1",
    rfid: "10135D", 
    team: "team1",
    carModel: "BMW M4",
    time: new Intl.DateTimeFormat(locale, options).format(now)
};

const record2 = {
    name: "Alex", 
    id: "#1",
    team: "team1",
    rfid: "10134E", 
    carModel: "BMW M4",
    time: new Intl.DateTimeFormat(locale, options).format(now)
};


const record3 = {
    name: "QQ", 
    id: "#3",
    team: "teamS",
    rfid: "10134R", 
    carModel: "McLaren",
    time: new Intl.DateTimeFormat(locale, options).format(now)
};



records.push(record1);
records.push(record2);
records.push(record3);

const btnCreate = document.querySelector(".show-create-modal");
// let btnsEditModal = document.querySelectorAll(".show-edit-modal");                  // dynamic element
const btnDeleteSelectRecordsModal = document.querySelector(".show-delete-modal");   // dynamic element
const btnsCloseEditModal = document.querySelector(".close-edit-modal");
const btnsCloseDeleteModal = document.querySelector(".close-delete-modal");
const btnModifyRecord = document.querySelector(".modify-record");                 // dynamic element
let btnsCancelRecord = document.querySelectorAll(".cancel-modify-record");


let isModified = false; 
let currRacerIndex = -1; 
let deleteRacerIndex = -1;

let editModal = document.querySelector(".edit-modal");                              // static
const deleteModal = document.querySelector(".delete-modal");                        // static
const table = document.querySelector(".table");                                     // static
const clearFix = document.querySelector(".clearfix");                               // static
const modalTitle = document.querySelector(".edit-modal-title");

const containerTable = document.querySelector(".table-body");                       // static


// Display all records 
const displayRecords = function(){

    // console.log(records);

    containerTable.innerHTML = "";
    records.forEach(function(record, i){

        const html = `
        <tr>
            <td>
                <span class="custom-checkbox">
                    <input type="checkbox" id="checkbox3" name="options[]" value="1">
                    <label for="checkbox3"></label>
                </span>
            </td>
            <td> ${record.name} </td>
            <td> ${record.id} </td>
            <td> ${record.rfid} </td>
            <td> ${record.team} </td>
            <td> ${record.carModel} </td>
            <td> ${record.time} </td>
            <td>
            <button class="show-edit-modal" value="${i}"> 修改</button>
            <button class="show-delete-modal" value="${i}"> 刪除</button> 
            
            </td>
        </tr>`;
        containerTable.insertAdjacentHTML('beforeend', html);
    });
    // btnsEditModal = document.querySelectorAll(".show-edit-modal");
};


displayRecords();

// const overlay = document.querySelector(".overlay");

// Hide Table 
const hideTable = function(){
    table.classList.add("hidden");
    clearFix.classList.add("hidden");
};


// Close Edit Button 
btnsCloseEditModal.addEventListener("click", function(e){
    e.preventDefault();
    alert("close");

    editModal.classList.add("hidden");
});

// Close Delete Button 
btnsCloseDeleteModal.addEventListener("click", function(e){
    e.preventDefault();
    alert("close");




    deleteModal.classList.add("hidden");
});


const clearEditMenu = function(){
    document.querySelector(".edit-modal-name").value = "";
    document.querySelector(".edit-modal-id").value = "";
    document.querySelector(".edit-modal-rfid").value = "";
    document.querySelector(".edit-modal-team").value = "";
    document.querySelector(".edit-modal-carModel").value = "";
};

function createAnRecord(){
    let newRecord = new Object();
    newRecord.name = document.querySelector(".edit-modal-name").value;
    newRecord.id = document.querySelector(".edit-modal-id").value;
    newRecord.rfid = document.querySelector(".edit-modal-rfid").value;
    newRecord.team = document.querySelector(".edit-modal-team").value;
    newRecord.carModel = document.querySelector(".edit-modal-carModel").value; 
    newRecord.time = new Intl.DateTimeFormat(locale, options).format(now);
    return newRecord; 
};

// Button to insert a new entry.
btnCreate.addEventListener("click", function(e){
    e.preventDefault();
    alert("create");
    isModified = false; 

    editModal.classList.remove("hidden");


    modalTitle.textContent = "新增賽車手資料";
    document.querySelector(".modify-record").value = "新增";
    clearEditMenu();


    // Wait for add button click callback function
});


const updateMenu = function(record){
    document.querySelector(".edit-modal-name").value = record.name;
    document.querySelector(".edit-modal-id").value = record.id;
    document.querySelector(".edit-modal-rfid").value = record.rfid;
    document.querySelector(".edit-modal-team").value = record.team;
    document.querySelector(".edit-modal-carModel").value = record.carModel;
}; 

// button modify a record
btnModifyRecord.addEventListener("click", function(e){
    e.preventDefault();
    console.log(e.target);

    let newRecord = createAnRecord();
    if(isModified === true)
        records[currRacerIndex] = newRecord;
    else{
        records.push(newRecord);
        currRacerIndex++;
    }
    
    displayRecords();
    editModal.classList.add("hidden");
});


// button cancel modifying a record
btnsCancelRecord.forEach(function(btnCancelRecord, i){

        btnCancelRecord.addEventListener("click", function(e){
            e.preventDefault();
            editModal.classList.add("hidden");
        });
});


// Button to Edit Selected Racer in the Row 
document.body.addEventListener("click",function(e){
    if(e.target.className === "show-edit-modal"){

        isModified= true;
        modalTitle.textContent = "修改賽車手資料";
        document.querySelector(".modify-record").value = "修改";

        currRacerIndex = Number(e.target.value);
        console.log(records[currRacerIndex]);
        updateMenu(records[currRacerIndex]);
        editModal.classList.remove("hidden");

        // wait for "add" button
    }

});


// Button to Delete Selected Racer in the Row 
document.body.addEventListener("click", function(e){
    if(e.target.className === "show-delete-modal"){
        console.log("hello");
        deleteModal.classList.remove("hidden");

        deleteRacerIndex = Number(e.target.value);
        console.log(deleteRacerIndex);

        // wait for DELETE Confirmation Button

    }
});

// DELETE Confirmation Button
document.querySelector(".btn-danger").addEventListener("click", function(e){
    e.preventDefault();
    console.log(1234);

    records.splice(deleteRacerIndex,1);
    displayRecords();
    deleteModal.classList.add("hidden");

});



// Delete Selected Racer(s) Button 
btnDeleteSelectRecordsModal.addEventListener("click", function(e){
    e.preventDefault();
    alert("delete");

    deleteModal.classList.remove("hidden");
});





