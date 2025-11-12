(function() {
  const apiKey = "l8t9EivkrWkL61e3YVgC2MslC6FITWAh";

  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
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

  async function searchGifs(event) {
    event.preventDefault();
    clearError();

    const query = searchInput.value.trim();
    if (!query) {
      showError("Wpisz frazę do wyszukania.");
      return;
    }

    gifContainer.innerHTML = '<p style="color: #888; grid-column: 1/-1; text-align: center;">Szukanie...</p>';
    gifContainer.className = ''; 

    const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=12&rating=g`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
      }

      const json = await response.json();
      gifContainer.innerHTML = '';

      if (!json.data || json.data.length === 0) {
        showError("Brak wyników dla podanej frazy.");
        return;
      }

      json.data.forEach(gif => {
        const img = document.createElement('img');
        img.src = gif.images.fixed_height.url;
        img.alt = gif.title;
        img.className = 'gif-item';
        gifContainer.appendChild(img);
      });

    } catch (error) {
      gifContainer.innerHTML = '';
      showError(error.message);
      console.error(error);
    }
  }


  async function fetchRandomGif() {
    clearError();
    searchInput.value = ''; 
    gifContainer.innerHTML = '<p style="color: #888; width: 100%; text-align: center;">Losowanie...</p>';
    gifContainer.className = 'single-view'; 

    const apiUrl = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&rating=g`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
      }

      const json = await response.json();
      gifContainer.innerHTML = '';

      if (!json.data || !json.data.images) {
        showError("Otrzymano puste dane.");
        return;
      }

      const img = document.createElement('img');
      img.src = json.data.images.original.url;
      img.alt = json.data.title;
      img.className = 'gif-item';

      gifContainer.appendChild(img);

    } catch (error) {
      gifContainer.innerHTML = '';
      showError(error.message);
      console.error(error);
    }
  }

  searchForm.addEventListener('submit', searchGifs);
  randomButton.addEventListener('click', fetchRandomGif);

})();