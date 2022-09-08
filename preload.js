
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

function SetupTable() {
    console.log("setup table")
    table = document.getElementById('MainTable')

    for (let x = 0; x < 6; x++) {
        InsertRow(table, x + 1);
    }

    //var row = table.insertRow();
    //var cell0 = row.insertCell(0);
    //var cell1 = row.insertCell(1);
    //var cell2 = row.insertCell(2);
    //var input = cell0.appendChild(document.createElement("INPUT"));
    //cell2.innerHTML = "test";
    //input.addEventListener("keypress", function (e) { OnKeyPress(e, table, row)});

}

function OnKeyPress(event, table, row) {
    console.log(event.key)
    console.log(row.rowIndex)
    if (event.key == "Enter")
    {
        InsertRow(table, row.rowIndex+1)
    }
}

function InsertRow(table, rowIndex) {
    row = table.insertRow(rowIndex);

    var cell0 = row.insertCell(0);
    var input = cell0.appendChild(document.createElement("INPUT"));
    input.addEventListener("keypress", function (e) { OnKeyPress(e, table, row) });

    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    cell2.innerHTML = "test";


}