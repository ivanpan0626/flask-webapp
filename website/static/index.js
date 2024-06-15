function deleteNote(noteId) {
    var confirmLogout = confirm("Delete note?");
   if(confirmLogout){
    fetch('/delete-note', {
        method: 'POST',
        body: JSON.stringify({noteId: noteId})
    }).then((_res) => {
        window.location.href="/notes"
    })
   }
}

function logout(){
   var confirmLogout = confirm("Are you sure you want to logout?");
   if(confirmLogout){
    window.location.href = "/logout"
   }
   else{
    window.localStorage.href = "/home"
   }
}