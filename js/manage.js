/**
 * BoomArt - Manage Page (CRUD Operations)
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('paintingForm');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const paintingId = document.getElementById('paintingId');
    const manageGrid = document.getElementById('manageGrid');
    const imageFile = document.getElementById('imageFile');
    const imageUrl = document.getElementById('imageUrl');
    const imagePreviewImg = document.getElementById('imagePreviewImg');
    const imagePreviewPlaceholder = document.getElementById('imagePreviewPlaceholder');

    let currentEditImageUrl = null; // When editing, holds existing image if not changed

    // Preview image from file or URL
    function showImagePreview(src) {
        if (src) {
            imagePreviewImg.src = src;
            imagePreviewImg.style.display = 'block';
            imagePreviewPlaceholder.style.display = 'none';
        } else {
            imagePreviewImg.src = '';
            imagePreviewImg.style.display = 'none';
            imagePreviewPlaceholder.style.display = 'block';
        }
    }

    // File selected from computer
    imageFile.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                showImagePreview(e.target.result);
                imageUrl.value = ''; // Clear URL when file selected
            };
            reader.readAsDataURL(file);
        } else {
            showImagePreview(currentEditImageUrl || null);
        }
    });

    // URL entered - show preview if valid
    imageUrl.addEventListener('blur', function() {
        const url = this.value.trim();
        if (url) {
            imagePreviewImg.onload = function() { showImagePreview(url); };
            imagePreviewImg.onerror = function() { showImagePreview(currentEditImageUrl || null); };
            imagePreviewImg.src = url;
            imagePreviewImg.style.display = 'block';
            imagePreviewPlaceholder.style.display = 'none';
        } else if (!imageFile.files.length) {
            showImagePreview(currentEditImageUrl || null);
        }
    });

    // Load paintings
    function renderManageGrid() {
        const paintings = DataStore.getPaintings();
        manageGrid.innerHTML = paintings.map(p => `
            <div class="manage-card">
                <img src="${p.imageUrl}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/260x180?text=No+Image'">
                <div class="manage-card-body">
                    <h3>${p.title}</h3>
                    <p>${p.description.substring(0, 80)}${p.description.length > 80 ? '...' : ''}</p>
                    <div class="price">$${parseFloat(p.price).toFixed(2)}</div>
                    <div class="manage-card-actions">
                        <button class="btn btn-outline" onclick="editPainting('${p.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="deletePainting('${p.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Get resolved image URL from form (file data URL, or URL input, or existing when editing)
    function getImageFromForm() {
        if (imageFile.files.length) {
            return new Promise(function(resolve) {
                const reader = new FileReader();
                reader.onload = function(e) { resolve(e.target.result); };
                reader.readAsDataURL(imageFile.files[0]);
            });
        }
        const url = imageUrl.value.trim();
        if (url) return Promise.resolve(url);
        if (currentEditImageUrl) return Promise.resolve(currentEditImageUrl);
        return Promise.resolve(null);
    }

    // Form submit - Add or Update
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = paintingId.value;

        getImageFromForm().then(function(imageSrc) {
            if (!imageSrc) {
                alert('Please choose an image from your computer or enter an image URL.');
                return;
            }

            const data = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                price: document.getElementById('price').value,
                imageUrl: imageSrc
            };

            if (id) {
                DataStore.updatePainting(id, data);
                alert('Painting updated successfully!');
                resetForm();
            } else {
                DataStore.addPainting(data);
                alert('Painting added successfully!');
                form.reset();
                clearImageInputs();
            }
            renderManageGrid();
        });
    });

    // Edit painting - populate form with image, description, price (and title)
    window.editPainting = function(id) {
        const painting = DataStore.getPaintingById(id);
        if (painting) {
            paintingId.value = painting.id;
            document.getElementById('title').value = painting.title;
            document.getElementById('description').value = painting.description;
            document.getElementById('price').value = painting.price;
            currentEditImageUrl = painting.imageUrl;
            imageUrl.value = painting.imageUrl && painting.imageUrl.startsWith('http') ? painting.imageUrl : '';
            imageFile.value = '';
            showImagePreview(painting.imageUrl);
            formTitle.textContent = 'Edit Painting';
            submitBtn.textContent = 'Update Painting';
            cancelBtn.style.display = 'inline-block';
        }
    };

    // Delete painting
    window.deletePainting = function(id) {
        if (confirm('Are you sure you want to delete this painting?')) {
            DataStore.deletePainting(id);
            renderManageGrid();
            if (paintingId.value === id) resetForm();
        }
    };

    // Cancel edit
    cancelBtn.addEventListener('click', resetForm);

    function clearImageInputs() {
        imageFile.value = '';
        imageUrl.value = '';
        currentEditImageUrl = null;
        showImagePreview(null);
    }

    function resetForm() {
        paintingId.value = '';
        form.reset();
        clearImageInputs();
        formTitle.textContent = 'Add New Painting';
        submitBtn.textContent = 'Add Painting';
        cancelBtn.style.display = 'none';
    }

    renderManageGrid();
});
