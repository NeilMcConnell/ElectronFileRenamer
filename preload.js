const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electron', {
    startDrag: (fileName) => {
        ipcRenderer.send('ondragstart', fileName)
    }
})


window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
    SetupTable();
    ShowDragCount(0);

})

const COL = {
    NewName: 0,
    SpacerBetweenNames: 1,
    ExistingFile: 2,
    Status: 3,
    Count: 4
}

function SetupTable() {
    console.log("setup table")
    table = document.getElementById('MainTable')
    InsertHeader(table, 0);

    for (let x = 1; x < 7; x++) {
        InsertRow(table, x);
    }
    AdjustInputForContents();
}

function InsertHeader(table, rowIndex) {
    row = table.insertRow(rowIndex);
    let cells = [];
    for (let x = 0; x < COL.Count; x++) {
        cells[x] = row.insertCell(x);
    }

    cells[COL.NewName].innerText = "New Name";
    cells[COL.NewName].setAttribute("class", "ColNewName RowHeader")

    cells[COL.ExistingFile].innerText = "Existing File";
    cells[COL.ExistingFile].setAttribute("class", "ColExistingFile RowHeader")
}

const ExistingFilePlaceHolder = "(drop image file here)";

function InsertRow(table, rowIndex) {
    let row = table.insertRow(rowIndex);

    let cells = [];
    for (let x = 0; x < COL.Count; x++) {
        cells[x] = row.insertCell(x);
    }


    var hiddenInputSpacer = cells[COL.NewName].appendChild(document.createElement("SPAN"));
    hiddenInputSpacer.setAttribute("class", "hiddenInputSpacer")

    var input = cells[COL.NewName].appendChild(document.createElement("INPUT"));
    input.addEventListener("keypress", function (e) { OnNewNameInputKeyPress(e, table, row) });
    input.onpaste = function (e) { return OnNewNamePaste(e, table, row) };

    cells[COL.SpacerBetweenNames].innerText = "--->";

    cells[COL.ExistingFile].innerText = ExistingFilePlaceHolder;
    cells[COL.ExistingFile].addEventListener("dragover", function (e) { e.preventDefault() }, false);
    cells[COL.ExistingFile].addEventListener("drop", function (e) { OnExistingFileDrop(e, table, row) });
    cells[COL.ExistingFile].addEventListener("dragenter", function (e) { OnExistingFileDragEnter(e) });
    cells[COL.ExistingFile].addEventListener("dragleave", function (e) { OnExistingFileDragLeave(e) });
    cells[COL.ExistingFile].addEventListener("dragleave", function (e) { e.target.setAttribute("class", "ColExistingFile") });


    cells[COL.NewName].setAttribute("class", "ColNewName")
    cells[COL.SpacerBetweenNames].setAttribute("class", "ColSpacerBetweenNames")
    cells[COL.ExistingFile].setAttribute("class", "ColExistingFile")
    cells[COL.Status].setAttribute("class", "ColStatus");
    return row;
}

function OnNewNameInputKeyPress(event, table, row) {
    console.log(event.key)
    console.log(row.rowIndex)
    if (event.key == "Enter") {
        let createdRow = InsertRow(table, row.rowIndex + 1);
        console.log(createdRow );
        createdRow.cells[COL.NewName].getElementsByTagName("INPUT")[0].focus();
    }
}

function OnNewNamePaste(event, table, row) {
    console.log(event)

    let pasted = event.clipboardData.getData("text")
    let pastedLines = pasted.split(/\r\n|\r|\n/)
    if (pastedLines.length < 2) {
        return true;
    }
    else {
        let input = row.cells[COL.NewName].getElementsByTagName("INPUT")[0];
        input.value = pastedLines[0];
        for (let x = 1; x < pastedLines.length; ++x) {
            let createdRow = InsertRow(table, row.rowIndex + x);
            let input = createdRow.cells[COL.NewName].getElementsByTagName("INPUT")[0];
            input.value = pastedLines[x];
        }
        let finalRow = InsertRow(table, row.rowIndex + pastedLines.length);
        finalRow.cells[COL.NewName].getElementsByTagName("INPUT")[0].focus();
        AdjustInputForContents();
        return false;
    }
}


//https://stackoverflow.com/questions/8100770/auto-scaling-inputtype-text-to-width-of-value  (a simple but pixel perfect solution)
function AdjustInputForContents() {
    table = document.getElementById('MainTable')
    let maxWidth = 200;

    for (row of table.rows) {
        let inputCell = row.cells[COL.NewName];
        let inputs = inputCell.getElementsByTagName("INPUT");
        let hiddenspacers = inputCell.getElementsByClassName("hiddenInputSpacer");

        if (inputs.length == 1 && hiddenspacers.length == 1) {
            hiddenspacers[0].textContent = inputs[0].value;
  
            maxWidth = Math.max(maxWidth, hiddenspacers[0].offsetWidth)
        }
    }

    console.log(maxWidth);

    for (row of table.rows) {
        let inputCell = row.cells[COL.NewName];
        let inputs = inputCell.getElementsByTagName("INPUT");
        if (inputs.length == 1 ) {
            inputs[0].style.width = maxWidth +  "px";
        }
    }

    SendUpdatedTableState();
}


function OnExistingFileDrop(event, table, row) {
    console.log("drop")
    let items = [];
    if (event.dataTransfer.items) {
        items = event.dataTransfer.items;
    }
    else {
        items = event.dataTransfer.files;
    }

    if (items.length != 1) {
        return null;
    }

    let cell = row.cells[COL.Status];

    let file = items[0].getAsFile();
    if (file != null) {
        event.target.innerText = file.path;
        SendUpdatedTableState();
        if (file.type.startsWith("image/")) {
            cell.innerText = "";
            let image = new Image(40, 40);
            image.src = file.path;
            cell.appendChild(image);
        }
        else {
            cell.innerHTML = "Not an image";
        }
    }
    event.target.setAttribute("class", "ColExistingFile")
}


function OnExistingFileDragEnter(e) {
    let items = [];
    if (e.dataTransfer.items) {
        items = e.dataTransfer.items;
    }
    else {
        items = e.dataTransfer.files;
    }

    console.log(items);

if (items.length == 1) {
        e.target.setAttribute("class", "ColExistingFile Selected")
    }
    else {
        e.target.setAttribute("class", "ColExistingFile Problem")
    }
}


function OnExistingFileDragLeave(e) {
    e.target.setAttribute("class", "ColExistingFile")
}


function SendUpdatedTableState() {
    console.log("SendUpdatedTableState")
    table = document.getElementById('MainTable')

    let newToExisting = new Object();

    for (row of table.rows) {
        console.log("I'm a row");
        let inputCell = row.cells[COL.NewName];
        let input = inputCell.getElementsByTagName("INPUT")[0];
        if (!input || !input.value)
            continue;
        console.log("I have input");

        let existingFileCell = row.cells[COL.ExistingFile];
        if (!existingFileCell.innerText || existingFileCell.innerText == ExistingFilePlaceHolder)
            continue;
        console.log("I have an existing file");

        newToExisting[input.value] = existingFileCell.innerText
    }

    ipcRenderer.send("ontableupdate", newToExisting);
}

function ShowDragCount(count) {
    let draggable = document.getElementById("drag");
    let itemText = count + ((count == 1) ? " item" : " items");
    let dragmeText = count == 0 ? "" : "(drag me to your destination folder)";
    draggable.innerText = itemText+ " ready to rename " + dragmeText
}

ipcRenderer.on('updateReadyCount', (event, count) => {
    ShowDragCount(count);
});
