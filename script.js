// script.js

// Handle form submission when the user submits the comment form
document.getElementById('comment-form').addEventListener('submit', function(e) {
	e.preventDefault(); // Prevent the default form submission (to avoid page reload)

	// Get the values entered by the user in the 'name' and 'comment' fields
	const name = document.getElementById('name').value;
	const comment = document.getElementById('comment').value;

	// Frontend fetch request to submit the comment to the backend (Node.js server)
	fetch('http://localhost:3000/submit-comment', {
			method: 'POST', // Set the HTTP method to POST
			headers: {
				'Content-Type': 'application/json', // Set the content type to JSON
			},
			body: JSON.stringify({
				name: name, // Sending the 'name' entered by the user
				comment: comment // Sending the 'comment' entered by the user
			})
		})
		.then(response => response.text()) // Handle the response as text
		.then(data => {
			console.log('Success:', data); // Log success message if the request is successful
			// Optionally reload comments to display the newly submitted comment
			loadComments();
		})
		.catch((error) => {
			console.error('Error:', error); // Log any errors if the request fails
		});

	// Reset the form after submission to clear the input fields
	document.getElementById('comment-form').reset();
});

// Function to fetch and display all comments from the backend
function loadComments() {
	// Fetch comments from the backend server
	fetch('http://localhost:3000/comments') // Use the full URL to avoid CORS issues
		.then(response => response.json()) // Parse the response as JSON
		.then(comments => {
			// Get the div element where comments will be displayed
			const displayDiv = document.getElementById('comment-display');
			displayDiv.innerHTML = ''; // Clear any previously displayed comments

			// Loop through the array of comments and create HTML elements for each comment
			comments.forEach(comment => {
				const commentElement = document.createElement('div');
				commentElement.innerHTML = `
            <strong>${comment.name}</strong>: ${comment.comment} <br>
            <em>Posted on ${new Date(comment.created_at).toLocaleString()}</em><hr>
          `;
				displayDiv.appendChild(commentElement); // Add the comment element to the display container
			});
		})
		.catch(error => console.error('Error loading comments:', error)); // Log any errors if fetching comments fails
}

// Load comments when the page loads for the first time
window.onload = loadComments; // Call the loadComments function when the window finishes loading