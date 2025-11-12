(function() {
  const apiKey = 'l8t9EivkrWkL61e3YVgC2MslC6FITWAh';
  const randomButton = document.getElementById('randomGifButton');
  const gifContainer = document.getElementById('gifContainer');
  const errorDiv = document.getElementById('errorMessage');

  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }

  function clearError() {
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
  }

  async function fetchRandomGif() {
    clearError();
    gifContainer.innerHTML = '<p>Losowanie...</p>';

    const apiUrl = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&rating=g`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
      }

      const json = await response.json();
      
      gifContainer.innerHTML = '';

      if (!json.data || !json.data.images) {
        showError("Otrzymano puste dane z API.");
        return;
      }

      const imageUrl = json.data.images.original.url;
      const title = json.data.title || "Losowy GIF";

      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      imgElement.alt = title;

      imgElement.onload = () => {
        if (gifContainer.contains(imgElement)) return;
        gifContainer.innerHTML = ''; 
        gifContainer.appendChild(imgElement);
      };

      gifContainer.appendChild(imgElement);

    } catch (error) {
      gifContainer.innerHTML = '';
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("Wystąpił nieoczekiwany błąd.");
      }
      console.error(error);
    }
  }

  randomButton.addEventListener('click', fetchRandomGif);
})();