let noteList = [];
const savebtn = document.querySelector("#firstSideBar > li > i.fas.fa-plus")
const noteContent = document.querySelector('#noteContent');
const input = document.querySelector('#search');
const saveToFav = document.querySelector('#saveFav');
const favIcon = document.querySelector("#firstSideBar > li > i.far.fa-heart");
let selectedNote;
const print = document.querySelector('#print');

// Sidabar
/* function openNav() {
  document.getElementById("secondSideBar").style.width = "300px";
  document.getElementById("editor").style.width = "70%";
  document.getElementById("editor").style.marginLeft = "420px";
}
function closeNav() {
  document.getElementById("secondSideBar").style.width = "0";
  document.getElementById("editor").style.width = "90%";
  document.getElementById("editor").style.marginLeft = "130px";
} */
/* Editor */

let toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  ['bold'], 
  ['italic'],
  ['underline'],
  ['link'],
  ['image'],
  [{ 'list': 'ordered' }], 
  [{ 'list': 'bullet' }],
  [{ 'align': [] }],
];

let Delta = Quill.import('delta');
let options = {
  modules: {
    toolbar: toolbarOptions
  },
  scrollingContainer: '#mainEditorContainer',
  placeholder: 'Write something fun...',
  theme: 'snow'
};

let editor = new Quill('#quillEditor', options);

//Save button
savebtn.addEventListener('click', () => {

  let note = {
    id: Date.now(),
    title: editor.getText(0, 10),
    contents: editor.getContents(),
    favourite: false,
    started: true
  };

  createDiv(note);
  noteList.unshift(note);
  saveNotes();
  clearEditor();
});

function createDiv(note) {
  let newDiv = document.createElement("div");
  newDiv.id = note.id;
  newDiv.classList.add('div');
  let newDivList = {
    title: `<strong>${note.title}....</strong>`,
    date: `<span>${Date(note.id)}</span>`,
    icon: `<span class='far fa-heart ${note.favourite ? 'fas fa-heart' : ''}'></span>`
  };
  newDiv.innerHTML = ` ${newDivList.title} <br> ${newDivList.date} ${newDivList.icon}`;
  
  if(document.readyState === "complete" || document.readyState === "loaded"){
    noteContent.insertBefore(newDiv, noteContent.childNodes[0])
  } else {noteContent.appendChild(newDiv)}
}

// Load localstorage när sidan laddar
window.addEventListener('DOMContentLoaded', (event) => {
  let quire = JSON.parse(localStorage.getItem('quire'));
  if (quire) {
    modal.style.display = "none";
  } else {
    modal.style.display = "block";
  }
  loadNotes();
});

//Laddar info från local storage
function loadNotes() {
  if (localStorage.getItem('quire')) {
    noteList = JSON.parse(localStorage.getItem('quire')).notes
    editor.setContents(noteList[0].contents);
    renderDocs();
  } else {
    noteList = [];
  }
}

//Rensar editorn
function clearEditor() {
  editor.setContents([
    { insert: '\n' }
  ]);
}

//Sparar dokumentet till local storage
function saveNotes() {
  localStorage.setItem('quire', JSON.stringify({ showSplash: true, notes: noteList }))
}


//Renderar dokumentet samt div när sidan laddas om
function renderDocs() {
  noteList.forEach(note => createDiv(note));
}

//Click event för divarna
noteContent.addEventListener('click', e => {
  const newDiv = document.querySelectorAll('#noteContent > div');
  const loadData = JSON.parse(localStorage.getItem('quire')).notes;
  let noteID = e.target.closest("div").id;
  selectedNote = noteList.find(note => note.id === Number(noteID));
  
  if (e.target.classList.contains('far')) {
    selectedNote.favourite = !selectedNote.favourite
    saveNotes();
    e.target.classList.toggle('fas'); 

  } else {
    for (let i = 0; i < loadData.length; i++) {
      if (loadData[i].id == e.target.parentElement.id || loadData[i].id == e.target.id) {
        editor.setContents(loadData[i].contents);
        newDiv.forEach(event => {
          if (e.target.parentElement === event || e.target === event) {
            event.classList.add('picked');
          } else { event.classList.remove('picked') }
        })
      }
    }
  }
}) 

function search() {
  let input = document.querySelector('#search');
  let filter = input.value.toUpperCase();
  for (let i = 0; i < noteContent.childNodes.length; i++) {
    textValue = noteContent.childNodes[i].childNodes[1].textContent || noteContent.childNodes[1].childNodes[2].innerText;
    if (textValue.toUpperCase().indexOf(filter) > -1) {
      noteContent.childNodes[i].style.display = "";
    } else {
      noteContent.childNodes[i].style.display = 'none';
    }
  }
}

input.addEventListener('keyup', e => {
  search();
  input.addEventListener('click', e => {
    noteContent.childNodes.forEach(e => { e.style.display = "block" })
  })
})

/* Popup */

// Get the modal
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
window.onload = function () {
  //modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function displayChecked() {
  let checkboxes = document.querySelectorAll('.fav > #noteContent > div > input');
  let arrayOfCheckboxes = Array.from(checkboxes);
  arrayOfCheckboxes.map(e => {
    if (e.checked) { e.parentElement.style.display = 'block' }
    else { e.parentElement.style.display = 'none' }
  })
}

let clicks = 1;
favIcon.addEventListener('click', e => {
  let arrayOfDivs = Array.from(noteContent.childNodes);
  
  clicks += 1;

  console.log(clicks);
  arrayOfDivs.forEach(div => {
    let noteID = div.id;
    selectedNote = noteList.find(note => note.id === Number(noteID));
    if(clicks % 2 === 0) {
      if(selectedNote.favourite){
      div.style.display = "block";
      } else { div.style.display = "none"}
    } else {div.style.display ="block"}

  })
})

function printDiv() {
  var divContents = document.querySelector(".ql-editor").innerHTML;
  var a = window.open('', '', 'height=1200, width=1200');
  a.document.write('<html>');
  a.document.write('<body > ');
  a.document.write(divContents);
  a.document.write('</body></html>');
  a.document.close();
  a.print();
}

print.addEventListener('click', () => {
  printDiv();
})