
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
  SetupTable()
})

const COL = {
    NewName: 0,
    SpacerBetweenNames: 1,
    ExistingFile: 2,
    Count: 3
}

function SetupTable() {
    console.log("setup table")
    table = document.getElementById('MainTable')
    InsertHeader(table, 0);

    for (let x = 1; x < 7; x++) {
        InsertRow(table, x);
    }
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


function InsertRow(table, rowIndex) {
    let row = table.insertRow(rowIndex);

    let cells = [];
    for (let x = 0; x < COL.Count; x++) {
        cells[x] = row.insertCell(x);
    }


    var input = cells[COL.NewName].appendChild(document.createElement("INPUT"));
    input.addEventListener("keypress", function (e) { OnNewNameInputKeyPress(e, table, row) });
    input.onpaste = function (e) { return OnNewNamePaste(e, table, row) };

    cells[COL.SpacerBetweenNames].innerText = "--->";

    cells[COL.ExistingFile].innerText = "Existing file goes here";


    cells[COL.NewName].setAttribute("class", "ColNewName")
    cells[COL.SpacerBetweenNames].setAttribute("class", "ColSpacerBetweenNames")
    cells[COL.ExistingFile].setAttribute("class", "ColExistingFile")
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
        row.cells[COL.NewName].getElementsByTagName("INPUT")[0].value = pastedLines[0];
        for (let x = 1; x < pastedLines.length; ++x) {
            let createdRow = InsertRow(table, row.rowIndex + x);
            createdRow.cells[COL.NewName].getElementsByTagName("INPUT")[0].value = pastedLines[x];
        }
        let finalRow = InsertRow(table, row.rowIndex + pastedLines.length);
        finalRow.cells[COL.NewName].getElementsByTagName("INPUT")[0].focus();

        return false;
    }
}
