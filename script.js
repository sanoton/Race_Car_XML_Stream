"use strict";

// The array of records. 
let records = [];
// let now = new Date();
let locale = "zh-TW";

// The set that stores the index of selected records for deletion
const deleteSet = new Set();

const options = {
    hour: "numeric",
    minute: "numeric", 
    day: "numeric", 
    month: "long", 
    year: "numeric", 
};

const record1 = {
    name: "Steven", 
    id: 1,
    rfid: "10135D", 
    team: "team1",
    carModel: "BMW M4",
    time: new Intl.DateTimeFormat(locale, options).format(new Date()),
    timestamp: Number(new Date())
};

const record2 = {
    name: "Alex", 
    id: 1,
    team: "team1",
    rfid: "10134E", 
    carModel: "BMW M4",
    time: new Intl.DateTimeFormat(locale, options).format(new Date()),
    timestamp: Number(new Date())
};


const record3 = {
    name: "QQ", 
    id: 3,
    team: "teamS",
    rfid: "10134R", 
    carModel: "McLaren",
    time: new Intl.DateTimeFormat(locale, options).format(new Date()),
    timestamp: Number(new Date())
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
const btnReadXML = document.querySelector(".read-xml");
// const btnStopReadXML = document.querySelector(".stop-read-xml");



const btnSortId = document.querySelector(".sort-id");
const btnSortTime = document.querySelector(".sort-time");
const btnConvertXML = document.querySelector(".convert-xml");

let isModified = false; 
let isDeleteMultiple = false; 
let currRacerIndex = -1; 
let deleteRacerIndex = -1;
let isAscending = true;
let isRecent = false;

let editModal = document.querySelector(".edit-modal");                              // static
const deleteModal = document.querySelector(".delete-modal");                        // static
const table = document.querySelector(".table");                                     // static
const clearFix = document.querySelector(".clearfix");                               // static
const modalTitle = document.querySelector(".edit-modal-title");

const containerTable = document.querySelector(".table-body");                       // static


let timer; 

// Display all records 
const displayRecords = function(){

    // console.log(records);

    containerTable.innerHTML = "";
    records.forEach(function(record, i){

        const html = `
        <tr class="tr">
            <td>
                <span class="custom-checkbox">
                    <input type="checkbox" id="checkbox3" name="options[]" value="${i}">
                    <label for="checkbox3"></label>
                </span>
            </td>
            <td class="xml" id="姓名">${record.name}</td>
            <td class="xml" id="卡號">${record.id}</td>
            <td class="xml" id="rfid">${record.rfid}</td>
            <td class="xml" id="車隊">${record.team}</td>
            <td class="xml" id="車型">${record.carModel}</td>
            <td class="xml" id="日期">${record.time}</td>
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

// Hide Table 
const hideTable = function(){
    table.classList.add("hidden");
    clearFix.classList.add("hidden");
};


// Close Edit Button 
btnsCloseEditModal.addEventListener("click", function(e){
    e.preventDefault();

    editModal.classList.add("hidden");
});

// Close Delete Button 
btnsCloseDeleteModal.addEventListener("click", function(e){
    e.preventDefault();

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
    newRecord.id = Number(document.querySelector(".edit-modal-id").value);
    newRecord.rfid = document.querySelector(".edit-modal-rfid").value;
    newRecord.team = document.querySelector(".edit-modal-team").value;
    newRecord.carModel = document.querySelector(".edit-modal-carModel").value; 
    newRecord.time = new Intl.DateTimeFormat(locale, options).format(new Date());
    newRecord.timestamp = Number(new Date());
    return newRecord; 
};

// Button to insert a new entry.
btnCreate.addEventListener("click", function(e){
    e.preventDefault();
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


// Button to Select a Racer in a Row
document.body.addEventListener("click", function(e){

    // check the edge case when reload the page
    if(e.target.id === "checkbox3"){
        if(e.target.checked === true)
            deleteSet.add(records[e.target.value].rfid);
        else
            deleteSet.delete(records[e.target.value].rfid);
    }
    console.log(deleteSet);
});


// Button to show deletion modal 
document.body.addEventListener("click", function(e){
    if(e.target.className === "show-delete-modal"){
        // console.log("hello");
        deleteModal.classList.remove("hidden");

        deleteRacerIndex = Number(e.target.value);
        console.log(deleteRacerIndex);

        isDeleteMultiple = (deleteRacerIndex === -1)? true: false;
        // wait for DELETE Confirmation Button

    }
});

// DELETE Confirmation Button
document.querySelector(".btn-danger").addEventListener("click", function(e){
    e.preventDefault();
    console.log(1234);

    if(isDeleteMultiple === false){
        records.splice(deleteRacerIndex,1);
        deleteRacerIndex = -1;
    }else{
        deleteSet.forEach(function(_,rfidValue){

            let rfidArr = [];
            records.forEach(function(val, i){
                rfidArr.push(val.rfid);
            });
            let foundIndex = rfidArr.indexOf(rfidValue);
            if(foundIndex != -1)    records.splice(foundIndex,1);
        });
        deleteSet.clear();
    }
    displayRecords();
    deleteModal.classList.add("hidden");

});

// Delete Multiple Racer(s) Button 
btnDeleteSelectRecordsModal.addEventListener("click", function(e){
    e.preventDefault();

    isDeleteMultiple = true; 

    deleteModal.classList.remove("hidden");

    // wait for DELETE Confirmation Button

});


// Button to sort the card id 
btnSortId.addEventListener("click", function(e){
    e.preventDefault();

    console.log(12345);
    if(isAscending)
        records.sort((a,b) => a.id - b.id);
    else
        records.sort((a,b) => b.id - a.id);
    
    isAscending = !isAscending;
    console.log(isAscending);
    console.log(records);
    displayRecords();
});


// Button to sort the time
btnSortTime.addEventListener("click", function(e){
    e.preventDefault();

    if(!isRecent)
        records.sort((a,b) => a.timestamp - b.timestamp);
    else
        records.sort((a,b) => b.timestamp - a.timestamp);
    
    isRecent = !isRecent;
    console.log(records);
    displayRecords();
});


// Button to convert to XML file
btnConvertXML.addEventListener("click", function(e){
    e.preventDefault();
    let writeData = `<?xml version="1.0"?> \n \t <contest> \n`;
    let allEntries = document.querySelectorAll(".xml");
    // allEntries.forEach(function(val,i){
    //     console.log(new XMLSerializer().serializeToString(allEntries[i]));
    // });


    for(let i = 0, k=0; i < records.length && k < allEntries.length; i++){
        if(i < records.length)  writeData += `\t\t`;
        writeData += `<card> \n`;
        let numOfFields = 6;
        let oneRecord = ``;
        for(let j = 0; j < numOfFields; j++,k++){
            if(j < 6) oneRecord += `\t\t\t`;
            // if(allEntries[k].id == "rfid") continue;
            oneRecord += `<${allEntries[k].id}>${allEntries[k].textContent}</${allEntries[k].id}> \n`;
        }
        oneRecord += `\t\t`;
        console.log(oneRecord + "\n\n");
        writeData += oneRecord; 
        writeData += `</card> \n`;

    }
    writeData += `\t</contest>`;


    // Method 2
    let textFile = null, makeTextFile = function (text) {
        let data = new Blob([text], {type: 'xml'});

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        // returns a URL you can use as a href
        return textFile;
    };

    let link = document.createElement("a");
    link.setAttribute("download", 'race_cars_info_tester.xml');
    link.href = makeTextFile(writeData);
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
      let event = new MouseEvent("click");
      link.dispatchEvent(event);
      document.body.removeChild(link);
    });

});


// Button to read data in current directory. 
btnReadXML.addEventListener("change", function(e){
    e.preventDefault();
    console.log("hi");

    let fr = new FileReader();
    fr.onload=function(){
        document.querySelector(".read-data-from-xml").textContent = fr.result;
        console.log(fr.result);
    }
      
    fr.readAsText(this.files[0]);
});


const displayTimer = function(){

    const tick = function(){
        const min = String(Math.trunc(time / 60)).padStart(2,0); 
        const sec = String(Math.trunc(time % 60)).padStart(2,0); 
        document.querySelector(".current-timer").textContent = `顯示當前計時器 ${min}:${sec}`;


        // Stop the timer!
        if(time === 0){
            time = 21;
        }

        // Decrement time by one 
        time--; 
    }; 

    let time = 20; 
    tick();
    const timer = setInterval(tick, 1000);      
    return timer;       
};

displayTimer();



