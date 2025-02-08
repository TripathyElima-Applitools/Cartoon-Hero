// script.js

// Handle form submission
document.getElementById('comment-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
  
    // Send comment to the backend
    fetch('/submit-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, comment })
    })
    .then(response => {
      if (response.ok) {
        alert('Comment submitted successfully!');
        loadComments();  // Reload comments after submission
      } else {
        alert('Failed to submit comment');
      }
    })
    .catch(error => alert('Error: ' + error));
  });
  
  // Fetch and display comments from the backend
  function loadComments() {
    fetch('/comments')
      .then(response => response.json())
      .then(comments => {
        const displayDiv = document.getElementById('comment-display');
        displayDiv.innerHTML = '';  // Clear previous comments
        
        comments.forEach(comment => {
          const commentElement = document.createElement('div');
          commentElement.innerHTML = `<strong>${comment.name}</strong>: ${comment.comment} <br><em>Posted on ${new Date(comment.created_at).toLocaleString()}</em><hr>`;
          displayDiv.appendChild(commentElement);
        });
      })
      .catch(error => console.error('Error loading comments:', error));
  }
  
  // Load comments when the page loads
  window.onload = loadComments;
  