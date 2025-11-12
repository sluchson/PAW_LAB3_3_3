        (function() {
          const apiKey = "l8t9EivkrWkL61e3YVgC2MslC6FITWAh";
          const limit = 12;

          const searchForm = document.getElementById('searchForm');
          const searchInput = document.getElementById('searchInput');
          const randomButton = document.getElementById('randomGifButton');
          const gifContainer = document.getElementById('gifContainer');
          const errorDiv = document.getElementById('errorMessage');

          const paginationControls = document.getElementById('paginationControls');
          const prevBtn = document.getElementById('prevBtn');
          const nextBtn = document.getElementById('nextBtn');
          const pageInfo = document.getElementById('pageInfo');

          let currentQuery = "";
          let currentOffset = 0;

          function showError(message) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
          }

          function clearError() {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
          }

          function showLoading() {
            gifContainer.innerHTML = '<p class="loading-text">Ładowanie...</p>';
          }

          function updatePaginationUI() {
            paginationControls.classList.remove('hidden');
            prevBtn.disabled = (currentOffset === 0);
            const pageNumber = Math.floor(currentOffset / limit) + 1;
            pageInfo.textContent = `Strona ${pageNumber}`;
          }

          async function performSearch() {
            clearError();
            showLoading();

            gifContainer.className = 'grid-view';

            const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(currentQuery)}&limit=${limit}&offset=${currentOffset}&rating=g`;

            try {
              const response = await fetch(apiUrl);
              if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);

              const json = await response.json();
              gifContainer.innerHTML = '';

              if (!json.data || json.data.length === 0) {
                showError("Brak wyników.");
                paginationControls.classList.add('hidden');
                return;
              }

              json.data.forEach(gif => {
                const card = document.createElement('div');
                card.className = 'gif-card';

                const img = document.createElement('img');
                img.src = gif.images.fixed_height.url;
                img.alt = gif.title;

                card.appendChild(img);
                gifContainer.appendChild(card);
              });

              updatePaginationUI();

              if (currentOffset > 0) {
                gifContainer.scrollIntoView({ behavior: 'smooth' });
              }

            } catch (error) {
              gifContainer.innerHTML = '';
              paginationControls.classList.add('hidden');
              showError("Wystąpił problem z połączeniem.");
            }
          }

          searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const query = searchInput.value.trim();

            if (!query) {
              showError("Proszę wpisać frazę.");
              return;
            }

            currentQuery = query;
            currentOffset = 0;

            performSearch();
          });

          nextBtn.addEventListener('click', function() {
            currentOffset += limit;
            performSearch();
          });

          prevBtn.addEventListener('click', function() {
            if (currentOffset >= limit) {
              currentOffset -= limit;
              if (currentOffset < 0) currentOffset = 0;
              performSearch();
            }
          });

          randomButton.addEventListener('click', async function() {
            clearError();
            searchInput.value = ''; 
            showLoading();

            paginationControls.classList.add('hidden');
            gifContainer.className = 'single-view';

            const apiUrl = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&rating=g`;

            try {
              const response = await fetch(apiUrl);
              if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);

              const json = await response.json();
              gifContainer.innerHTML = '';

              if (!json.data || !json.data.images) {
                showError("Błąd API.");
                return;
              }

              const img = document.createElement('img');
              img.src = json.data.images.original.url;
              img.alt = json.data.title;

              img.onload = () => {
                gifContainer.innerHTML = ''; 
                gifContainer.appendChild(img);
              };
              gifContainer.appendChild(img);

            } catch (error) {
              gifContainer.innerHTML = '';
              showError("Wystąpił problem z połączeniem.");
            }
          });

        })();