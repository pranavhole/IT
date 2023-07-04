const usernameElement = document.getElementById('username');
const createPostForm = document.getElementById('createPostForm');
const userPostsContainer = document.getElementById('userPosts');
const trending = document.getElementsByClassName('div1');


// Get username from URL parameter

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
usernameElement.textContent = username;

// Event listener for create post form submission

createPostForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const topic = document.getElementById('topic').value;
  const post = document.getElementById('post').value;

  // Send post data to the server
  fetch('http://127.0.0.1:3000/posts/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic, post, user: username }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Clear form fields
      document.getElementById('topic').value = '';
      document.getElementById('post').value = '';

      // Fetch and display user's posts
      fetchUserPosts();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

function fetchUserPosts() {
  fetch(`http://127.0.0.1:3000/posts/user/${username}`)
    .then((response) => response.json())
    .then((data) => {
      userPostsContainer.innerHTML = '';

      data.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
          <h3>Topic: ${post.topic}</h3>
          <p>${post.post}</p>
          <button class="likeBtn">Like (${post.likes})</button>
          <button class="commentBtn">Comment</button>
          <div class="comments">
            ${getCommentsHTML(post.comments)}
          </div>
          <hr>
        `;

        userPostsContainer.appendChild(postElement);

        // Event listener for like button
        const likeBtn = postElement.querySelector('.likeBtn');
        likeBtn.addEventListener('click', () => {
          likePost(post._id);
        });

        // Event listener for comment button
        const commentBtn = postElement.querySelector('.commentBtn');
        commentBtn.addEventListener('click', () => {
          const comment = prompt('Enter your comment:');
          if (comment) {
            addComment(post._id, comment);
          }
        });
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Function to generate HTML for comments
function getCommentsHTML(comments) {

  let html = '';
  comments.forEach((comment) => {
    console.log(comment.comment)
    html += `<p>${comment.comment}</p>`;
  });
  return html;
}

// Function to like a post
function likePost(postId) {
  const user = username;
  fetch(`http://127.0.0.1:3000/posts/like/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Refresh user posts
      fetchUserPosts();
      allpost();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Function to add a comment to a post
function addComment(postId, comment) {
  const user = username;
  fetch(`http://127.0.0.1:3000/posts/comment/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, comment }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Refresh user posts
      fetchUserPosts();
      allpost()
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
const postsContainer = document.getElementById('postsContainer');

// Fetch all posts
function allpost() {
  fetch('http://localhost:3000/posts/all')
    .then((response) => response.json())
    .then((posts) => {
      postsContainer.innerHTML = '';
      posts.sort((b, a) => (a.likes + a.comments.length) - (b.likes + b.comments.length));
      posts.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
        <h3>Topic: ${post.topic}</h3>
        <p>${post.post}</p>
        <button class="likeBtn" data-postid="${post._id}">Like (${post.likes})</button>
        <button class="commentBtn" data-postid="${post._id}">Comment</button>
        <div class="comments">
          ${getCommentsHTML(post.comments)}
        </div>
        <hr>
      `;

        postsContainer.appendChild(postElement);

        // Event listener for like button
        const likeBtn = postElement.querySelector('.likeBtn');
        likeBtn.addEventListener('click', () => {
          likePost(post._id);
        });

        // Event listener for comment button
        const commentBtn = postElement.querySelector('.commentBtn');
        commentBtn.addEventListener('click', () => {
          const postId = commentBtn.dataset.postid;
          const comment = prompt('Enter your comment:');
          if (comment) {
            addComment(postId, comment);
          }
        });
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Function to generate HTML for comments
function getCommentsHTML(comments) {
  let html = '';
  comments.forEach((comment) => {
    html += `<p>${comment.comment}</p>`;
  });
  return html;
}

// Function to like a post
// function likePost(postId) {
//   const user = username;
//   fetch(`http://127.0.0.1:3000/posts/like/${postId}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ user }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       // Refresh user posts
//       fetchUserPosts();
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
// }

// // Function to add a comment to a post
// function addComment(postId, comment) {
//   const user = username;
//   fetch(`http://127.0.0.1:3000/posts/comment/${postId}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ user, comment }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       // Refresh user posts
//       fetchUserPosts();
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
// }

// Fetch and display user's posts on page load
fetchUserPosts();
allpost()