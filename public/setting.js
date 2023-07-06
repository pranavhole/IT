const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const deleteUser= document.getElementById('delete')
console.log(username);
deleteUser.addEventListener('click',(e)=>{
    fetch('https://localhost:3000/delete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ username:username}),
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    console.log('User deleted successfully');
  })
  .catch(error => {
    console.error('Error deleting user:', error);
  });
})
