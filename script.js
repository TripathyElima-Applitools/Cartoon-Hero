// script.js
// Get the buttons, and result display elements
const userChoiceDisplay = document.getElementById('user-choice');
const computerChoiceDisplay = document.getElementById('computer-choice');
const resultDisplay = document.getElementById('result');

const rockButton = document.getElementById('rock');
const paperButton = document.getElementById('paper');
const scissorsButton = document.getElementById('scissors');

// Possible choices for the computer
const choices = ['Rock', 'Paper', 'Scissors'];

// Event listeners for user's choices
rockButton.addEventListener('click', () => playGame('Rock'));
paperButton.addEventListener('click', () => playGame('Paper'));
scissorsButton.addEventListener('click', () => playGame('Scissors'));

// Function to play the game
function playGame(userChoice) {
  // Display the user's choice
  userChoiceDisplay.textContent = `You chose: ${userChoice}`;

  // Get the computer's random choice
  const computerChoice = getComputerChoice();
  computerChoiceDisplay.textContent = `Computer chose: ${computerChoice}`;

  // Determine the result of the game
  const result = determineWinner(userChoice, computerChoice);
  resultDisplay.textContent = result;
}

// Function to randomly choose for the computer
function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

// Function to determine the winner
function determineWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    return 'It\'s a tie!';
  }

  if (
    (userChoice === 'Rock' && computerChoice === 'Scissors') ||
    (userChoice === 'Scissors' && computerChoice === 'Paper') ||
    (userChoice === 'Paper' && computerChoice === 'Rock')
  ) {
    return 'You win!';
  } else {
    return 'Computer wins!';
  }
}

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

const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('nav ul');
const navLinks = document.querySelectorAll('nav ul li a'); // Select all links in the nav

menuToggle.addEventListener('click', () => {
  navList.classList.toggle('active');
});

// Close the menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('active'); // Close the menu
  });
});

