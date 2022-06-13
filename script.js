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
const btnReadXML = document.querySelector(".read-xml-file");
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
            <td class="write-xml" id="姓名">${record.name}</td>
            <td class="write-xml" id="卡號">${record.id}</td>
            <td class="write-xml" id="rfid">${record.rfid}</td>
            <td class="write-xml" id="車隊">${record.team}</td>
            <td class="write-xml" id="車型">${record.carModel}</td>
            <td class="write-xml" id="日期">${record.time}</td>
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
});


// Button to show deletion modal 
document.body.addEventListener("click", function(e){
    if(e.target.className === "show-delete-modal"){
        deleteModal.classList.remove("hidden");

        deleteRacerIndex = Number(e.target.value);

        isDeleteMultiple = (deleteRacerIndex === -1)? true: false;
        // wait for DELETE Confirmation Button

    }
});

// DELETE Confirmation Button
document.querySelector(".btn-danger").addEventListener("click", function(e){
    e.preventDefault();

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

    if(isAscending)
        records.sort((a,b) => a.id - b.id);
    else
        records.sort((a,b) => b.id - a.id);
    
    isAscending = !isAscending;
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
    displayRecords();
});


// Button to convert to XML file
btnConvertXML.addEventListener("click", function(e){
    e.preventDefault();
    let writeData = `<?xml version="1.0"?> \n \t <contest> \n`;
    let allEntries = document.querySelectorAll(".write-xml");
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
        // console.log(oneRecord + "\n\n");
        writeData += oneRecord; 
        writeData += `</card> \n`;

    }
    writeData += `\t</contest>`;


    // Race_cars_info_tester will be stored in the download folder of the browser. 
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


// ********************** New functionality *******************
const containerReadTable = document.querySelector(".table-body-2");                       // static


// Display all records 
const displayReadRecords = function(){

    containerReadTable.innerHTML = "";
    console.log(records2);
    records2.forEach(function(record, i){
        const html = `
            <tr class="tr">
                <td>
                    <span class="custom-checkbox">
                        <input type="checkbox" id="checkbox3" name="options[]" value="${i}">
                        <label for="checkbox3"></label>
                    </span>
                </td>
                <td class="read-xml" id="姓名">${record.name}</td>
                <td class="read-xml" id="卡號">${record.id}</td>
                <td class="read-xml" id="rfid">N/A</td>
                <td class="read-xml" id="車隊">${record.team}</td>
                <td class="read-xml" id="車型">${record.carModel}</td>
                <td class="read-xml" id="日期">${record.date}</td>
                <td class="read-xml" id="第一圈秒數">${record.lamp1Score}</td>
                <td class="read-xml" id="第二圈秒數">${record.lamp2Score}</td>
                <td class="read-xml" id="第三圈秒數">${record.lamp3Score}</td>
                <td class="read-xml" id="第四圈秒數">${record.lamp4Score}</td>
                <td class="read-xml" id="第五圈秒數">${record.lamp5Score}</td>
                <td class="read-xml" id="最佳圈秒數">${record.bestLampScore}</td>
                <td class="read-xml" id="排名">${record.rank}</td>
            </tr>`;
        containerReadTable.insertAdjacentHTML('beforeend', html);
    });
};

let readXMLData; 
let temp; 
let nameArr = [];
let idArr = [];
// let rfidArr = [];
let teamArr = [];
let carModelArr = [];
let dateArr = [];
let lamp1Arr = [];
let lamp2Arr = [];
let lamp3Arr = [];
let lamp4Arr = [];
let lamp5Arr = [];
let bestLampArr = [];
let rankArr = [];
let records2 = [];


// Populate -1 to indicate the score is not ready. 
const populateLampArrs = function(strArr){
    for(let i = 0; i < strArr.length; i++){

        lamp1Arr.push('');
        lamp2Arr.push('');
        lamp3Arr.push('');
        lamp4Arr.push('');
        lamp5Arr.push('');
        bestLampArr.push('');
    }
};


// Parse an array of strings
const parseStringArrToRecords = function(strArr){


    populateLampArrs(strArr);
    strArr.forEach(function(str,i){

        let strArrForOneRacer = str.split(`\n`);

        strArrForOneRacer.forEach(function(val,j){
            if(val.includes(`<姓名>`))
                nameArr.push(val.trim().replace(`<姓名>`, "").replace(`</姓名>`, ""));
            else if(val.includes(`<卡號>`))
                idArr.push(val.trim().replace(`<卡號>`, "").replace(`</卡號>`, ""));
            else if(val.includes(`<車隊>`))
                teamArr.push(val.trim().replace(`<車隊>`, "").replace(`</車隊>`, ""));
            else if(val.includes(`<車型>`))
                carModelArr.push(val.trim().replace(`<車型>`, "").replace(`</車型>`, ""));
            else if(val.includes(`<日期>`))
                dateArr.push(val.trim().replace(`<日期>`, "").replace(`</日期>`, ""));
            else if(val.includes(`<第一圈秒數>`))
                lamp1Arr[i] = (val.trim().replace(`<第一圈秒數>`, "").replace(`</第一圈秒數>`, ""));
            else if(val.includes(`<第二圈秒數>`))
                lamp2Arr[i] = (val.trim().replace(`<第二圈秒數>`, "").replace(`</第二圈秒數>`, ""));
            else if(val.includes(`<第三圈秒數>`))
                lamp3Arr[i] = (val.trim().replace(`<第三圈秒數>`, "").replace(`</第三圈秒數>`, ""));
            else if(val.includes(`<第四圈秒數>`))
                lamp4Arr[i] = (val.trim().replace(`<第四圈秒數>`, "").replace(`</第四圈秒數>`, ""));
            else if(val.includes(`<第五圈秒數>`))
                lamp5Arr[i] = (val.trim().replace(`<第五圈秒數>`, "").replace(`</第五圈秒數>`, ""));
            else if(val.includes(`<最佳圈秒數>`))
                bestLampArr[i] = (val.trim().replace(`<最佳圈秒數>`, "").replace(`</最佳圈秒數>`, ""));
            else if(val.includes(`<排名>`))
                rankArr.push(val.trim().replace(`<排名>`, "").replace(`</排名>`, ""));
        });


    });

    // console.log(nameArr);
    // console.log(idArr);
    // console.log(teamArr);
    // console.log(carModelArr);
    // console.log(dateArr);
    // console.log(lamp1Arr);
    // console.log(lamp2Arr);
    // console.log(lamp3Arr);
    // console.log(lamp4Arr);
    // console.log(lamp5Arr);
    // console.log(bestLampArr);


    for(let i = 0; i < nameArr.length; i++){
        // let newRecord = new Object();
        let newRecord = new Object();
        newRecord.name = nameArr[i];
        newRecord.id =  idArr[i];
        newRecord.team = teamArr[i];
        newRecord.carModel = carModelArr[i];
        newRecord.date = dateArr[i];
        newRecord.lamp1Score = lamp1Arr[i];
        newRecord.lamp2Score = lamp2Arr[i];
        newRecord.lamp3Score = lamp3Arr[i];
        newRecord.lamp4Score = lamp4Arr[i];
        newRecord.lamp5Score = lamp5Arr[i];
        newRecord.bestLampScore = bestLampArr[i];
        newRecord.rank       = rankArr[i];
        // console.log(newRecord);
        records2.push(newRecord);           // global variable
    }
};


let readRacersArr;
// Button to read data in current directory. Remember to clear the previous records!!
btnReadXML.addEventListener("change", function(e){
    e.preventDefault();

    let fr = new FileReader();
    fr.onload=function(){
        // console.log(records2);
        // records2 = [];
        readXMLData = fr.result;
        records2 = [];
        // console.log(readXMLData);

        // To get each racer's unique information, we should splite the string by <row> 
        readRacersArr = readXMLData.replaceAll(`\t`, ``).replace(`<csv_data>`,``).replace(`</csv_data>`, ``).replaceAll(`</row>`,``)
                            .replace(`<?xml version="1.0"?>`,``).split(`<row>`);
                        
        readRacersArr.shift();

        parseStringArrToRecords(readRacersArr);
        displayReadRecords();
    }
    fr.readAsText(this.files[0]);
});

document.querySelector(".refresh-page").addEventListener("click", function(e){
    e.preventDefault();
    location.reload();
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



