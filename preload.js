
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
    row = table.insertRow(rowIndex);

    var cell0 = row.insertCell(0);
    var input = cell0.appendChild(document.createElement("INPUT"));
    input.addEventListener("keypress", function (e) { OnNewNameInputKeyPress(e, table, row) });

    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    cell2.innerHTML = "test";
}

function OnNewNameInputKeyPress(event, table, row) {
    console.log(event.key)
    console.log(row.rowIndex)
    if (event.key == "Enter") {
        InsertRow(table, row.rowIndex + 1)
    }
}
