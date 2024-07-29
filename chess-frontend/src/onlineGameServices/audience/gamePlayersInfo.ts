// Define interfaces to match the structure of your player data
interface PlayerData {
    createdAt: string;
    email: string;
    id: number;
    joinedAt: string;
    name: string;
    passwordHash: string;
    profilePicture: string;
    role: string;
    roomId: number;
    socketId: string;
    updatedAt: string;
    userId: number;
  }
  
  // Function to create and display player vs player information
 export  function displayPlayerVsPlayer(players: PlayerData[]) {
    const container = document.getElementById('player-vs-player-container');
    if (container) {
      // Clear any existing content
      container.innerHTML = '';
  
      // Create container for player vs player info
      const playerVsPlayerDiv = document.createElement('div');
      playerVsPlayerDiv.classList.add('player-vs-player');
  
      // Iterate over players array
      players.forEach((player, index) => {
        // Create player info container
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
  
        // Create and append player name
        const playerName = document.createElement('h2');
        playerName.textContent = player.name;
        playerDiv.appendChild(playerName);
        const playerColor = document.createElement('h2');
        playerDiv.appendChild(playerColor);
  
        // Create and append player picture
        const playerPicture = document.createElement('img');
        playerPicture.src = player.profilePicture;
        playerPicture.alt = player.name;
        playerPicture.classList.add('player-picture');
        playerDiv.appendChild(playerPicture);
  
        // Add color based on index (0 for white, 1 for black)
        playerColor.textContent = index === 0 ? 'Color: White' : 'Color: Black';
        
  
        // Append playerDiv to playerVsPlayerDiv
        playerVsPlayerDiv.appendChild(playerDiv);
      });
  
      // Append playerVsPlayerDiv to container
      container.appendChild(playerVsPlayerDiv);
    }
  }