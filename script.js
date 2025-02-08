// script.js

// Handle form submission
document.getElementById('comment-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
  
    // Frontend fetch request to submit the comment to the backend
    fetch('http://localhost:3000/submit-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,      // Using form data for name
        comment: comment // Using form data for comment
      })
    })
    .then(response => response.text()) // Since we're sending text back, let's handle that
    .then(data => {
      console.log('Success:', data);
      // Optionally reload comments to display the new one
      loadComments();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  
    // Reset the form after submission
    document.getElementById('comment-form').reset();
  });
  
  // Fetch and display comments from the backend
  function loadComments() {
    fetch('http://localhost:3000/comments')  // Adjusted to the full URL to avoid CORS issues
      .then(response => response.json())
      .then(comments => {
        const displayDiv = document.getElementById('comment-display');
        displayDiv.innerHTML = '';  // Clear previous comments
  
        comments.forEach(comment => {
          const commentElement = document.createElement('div');
          commentElement.innerHTML = `
            <strong>${comment.name}</strong>: ${comment.comment} <br>
            <em>Posted on ${new Date(comment.created_at).toLocaleString()}</em><hr>
          `;
          displayDiv.appendChild(commentElement);
        });
      })
      .catch(error => console.error('Error loading comments:', error));
  }
  
  // Load comments when the page loads
  window.onload = loadComments;
  