//from https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop

document.getElementById('drag').ondragstart = (event) => {
    event.preventDefault()
    window.electron.startDrag('drag-and-drop.md')
    console.log("got this far (start)");
}

document.getElementById('drag').ondragendd = (event) => {
    console.log("got this far (drop)");
    event.preventDefault()
    window.electron.drop('drag-and-drop.md')
}