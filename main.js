const databaseUrl = 'https://trees-897c3-default-rtdb.firebaseio.com/';

    function showPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageName).classList.add('active');
  if (pageName === 'home') {
    getTrees();
  }
}function showPage(pageName) {
  document.querySelector('.skeleton-container').style.display = 'none';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageName).classList.add('active');
  if (pageName === 'home') {
    getTrees();
  }
}

    function getTrees() {
      
  const treeRef = `${databaseUrl}trees.json`;
  fetch(treeRef)
  .then((response) => response.json())
  .then((data) => {
    if (data) {
      document.querySelector('.skeleton-container').style.display = 'none';
      const grid = document.getElementById('treeGrid');
      grid.innerHTML = '';
      for (const treeId in data) {
        const tree = data[treeId];
        grid.innerHTML += `
          <div class="tree-card" onclick="showTreeDetail('${treeId}')">
            <img src="${tree.images[0]}" alt="${tree.name}" class="tree-card-image">
            <div class="tree-card-content">
              <h3>${tree.name}</h3>
              <p>Click to learn more</p>
            </div>
          </div>
        `;
      }
    } else {
      const grid = document.getElementById('treeGrid');
      grid.innerHTML = 'No trees added yet!';
    }
  })
  .catch((error) => console.error(error));
}

  function showTreeDetail(treeId) {
  const treeRef = `${databaseUrl}trees/${treeId}.json`;
  fetch(treeRef)
  .then((response) => response.json())
  .then((tree) => {
    const content = document.getElementById('treeDetailContent');
    content.innerHTML = `
      <h2>${tree.name}</h2>
      <div class="tree-images">
        ${tree.images.map(img => `<img src="${img}" alt="${tree.name}">`).join('')}
      </div>
      <p style="color: #2e7d32; line-height: 1.9; margin: 25px 0; font-size: 1.1em;">${tree.description}</p>
      <div class="suggestion-form">
        <h3>Share Your Suggestion</h3>
        <input type="text" id="suggestionInput" placeholder="Enter your suggestion about this tree...">
        <button onclick="addSuggestion('${treeId}')">Submit Suggestion</button>
      </div>
      <div class="suggestions-list">
        <h3>Community Suggestions</h3>
        <div id="suggestionsList">
          ${tree.suggestions ? Object.values(tree.suggestions).map(s => `
            <div class="suggestion-item">
              <p>${s}</p>
            </div>
          `).join('') : ''}
        </div>
      </div>
      <button class="share-button" onclick="shareTree('${treeId}')">Share this tree</button>
    `;
    showPage('treeDetail');
  })
  .catch((error) => console.error(error));
}
function showAdminPanel() {
  document.querySelector('.skeleton-container').style.display = 'none';
  const password = prompt("Enter admin password:");
  if (password === "2026") {
    // Show admin panel content
    document.getElementById('admin-panel').style.display = 'block';
  } else {
    alert("Incorrect password");
  }
}

function shareTree(treeId) {
  const url = `${window.location.origin}/tree/${treeId}`;
  if (navigator.share) {
    navigator.share({
      title: 'Check out this tree!',
      text: 'I found this amazing tree!',
      url: url,
    })
    .then(() => console.log('Shared successfully'))
    .catch((error) => console.error('Error sharing:', error));
  } else {
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard!');
    });
  }
}
 function addTree() {
      const name = document.getElementById('treeName').value;
      const description = document.getElementById('treeDescription').value;
      const files = document.getElementById('treeImages').files;
      if (name && description && files.length > 0) {
        const uploadPreset = 'arapmeliketik'; 
        const cloudName = 'dpbw6l6iq'; 
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const images = [];
        let processed = 0;
        Array.from(files).forEach((file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);
          fetch(url, {
            method: 'POST',
            body: formData,
          })
          .then((response) => response.json())
          .then((data) => {
            images.push(data.secure_url);
            processed++;
            if (processed === files.length) {
              const treeRef = `${databaseUrl}trees.json`;
              fetch(treeRef, {
                method: 'POST',
                body: JSON.stringify({
                  name: name,
                  description: description,
                  images: images,
                  suggestions: []
                }),
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              .then((response) => response.json())
              .then((data) => {
                
                document.querySelector('.skeleton-container').style.display = 'none';
                
                
                document.getElementById('treeName').value = '';
                document.getElementById('treeDescription').value = '';
                document.getElementById('treeImages').value = '';
                document.getElementById('imagePreview').innerHTML = '';
                alert('Tree added successfully!');
                showPage('home');
              })
              .catch((error) => console.error(error));
            }
          })
          .catch((error) => console.error(error));
        });
      } else {
        alert('Please fill all fields and select at least one image');
      }
    }

   function addSuggestion(treeId) {
const input = document.getElementById('suggestionInput');
const suggestion = input.value.trim();
if (suggestion) {
const suggestionRef = `${databaseUrl}trees/${treeId}/suggestions.json`;
fetch(suggestionRef, {
method: 'POST',
body: JSON.stringify(suggestion),
headers: {
'Content-Type': 'application/json'
}
})
.then((response) => response.json())
.then((data) => {
input.value = '';
showTreeDetail(treeId);
})
.catch((error) => console.error(error));
}
}


    document.getElementById('treeImages').addEventListener('change', function(e) {
      const preview = document.getElementById('imagePreview');
      preview.innerHTML = '';
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
          const img = document.createElement('img');
          img.src = event.target.result;
          preview.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    });

    getTrees();
