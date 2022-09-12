//from https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop

document.getElementById('drag').ondragstart = (event) => {
    event.preventDefault()
    window.electron.startDrag('drag-and-drop.md')
    console.log("got this far (start)");
}
