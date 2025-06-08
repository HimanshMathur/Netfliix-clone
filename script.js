// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Search Bar Toggle
const searchIcon = document.querySelector('.fa-search');
const searchBar = document.querySelector('.search-bar');
if (searchIcon && searchBar) {
    searchIcon.addEventListener('click', () => {
        searchBar.classList.toggle('active');
    });
}

// Profile Navigation
const profileLink = document.querySelector('.navbar-right a.profile-icon');
if (profileLink) {
    profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'profile.html';
    });
}

// Carousel Navigation
document.querySelectorAll('.content-row').forEach(row => {
    const carouselControls = row.closest('.content-section').querySelector('.carousel-controls');
    if (!carouselControls) return;

    const prevBtn = carouselControls.querySelector('.carousel-btn.prev');
    const nextBtn = carouselControls.querySelector('.carousel-btn.next');

    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            row.scrollBy({ left: 300, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            row.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }
});

// My List Functionality
let myList = JSON.parse(localStorage.getItem('myList')) || [];

function renderMyList() {
    const myListRow = document.querySelector('#my-list-row');
    if (!myListRow) return;

    myListRow.innerHTML = '';
    myList.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('content-card');
        card.dataset.id = item.id;
        card.style.backgroundImage = `url('${item.image}')`;
        card.innerHTML = `
            <div class="netflix-badge">N</div>
            <div class="overlay-bottom">
                <h3 class="card-title">${item.title}</h3>
                <div class="overlay-control">
                    <div class="control-btn play-btn"><i class="fas fa-play"></i></div>
                    <div class="control-btn check-btn" data-action="remove-from-list"><i class="fas fa-minus"></i></div>
                    <div class="control-btn thumbs-btn"><i class="fas fa-thumbs-up"></i></div>
                    <div class="control-btn more-btn"><i class="fas fa-info-circle"></i></div>
                </div>
                <div class="overlay-info">
                    <div class="info-batch">${item.rating || 'TV-MA'}</div>
                    <div class="info-batch">${item.genre || 'Unknown'}</div>
                    <div class="info-batch">HD</div>
                </div>
            </div>
        `;
        myListRow.appendChild(card);
    });
}

// Watch History Functionality
let watchHistory = JSON.parse(localStorage.getItem('watchHistory')) || [];

function renderWatchHistory() {
    const watchHistoryList = document.querySelector('#watch-history-list');
    if (!watchHistoryList) return;

    watchHistoryList.innerHTML = '';
    watchHistory.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.image}" alt="${item.title}" />
            <div>
                <h3>${item.title}</h3>
                <p>Watched on ${item.date}</p>
            </div>
        `;
        watchHistoryList.appendChild(li);
    });
}

// Add/Remove from My List and Watch History
document.addEventListener('click', (e) => {
    const button = e.target.closest('.control-btn');
    if (!button) return;

    const card = button.closest('.content-card');
    if (!card) return;

    const id = card.dataset.id;
    const title = card.querySelector('.card-title')?.textContent;
    const imageMatch = card.style.backgroundImage?.match(/url\(['"](.*)['"]\)/);
    const image = imageMatch ? imageMatch[1] : '';
    const infoBatches = card.querySelectorAll('.info-batch');
    const rating = infoBatches[0]?.textContent || 'TV-MA';
    const genre = infoBatches[1]?.textContent || 'Unknown';

    if (!id || !title || !image) return;

    if (button.classList.contains('check-btn')) {
        const action = button.dataset.action;
        if (action === 'add-to-list') {
            if (!myList.find(item => item.id === id)) {
                myList.push({ id, title, image, rating, genre });
                localStorage.setItem('myList', JSON.stringify(myList));
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.dataset.action = 'remove-from-list';
            }
        } else if (action === 'remove-from-list') {
            const index = myList.findIndex(item => item.id === id);
            if (index !== -1) {
                myList.splice(index, 1);
                localStorage.setItem('myList', JSON.stringify(myList));
                button.innerHTML = '<i class="fas fa-plus"></i>';
                button.dataset.action = 'add-to-list';
                if (window.location.pathname.includes('my-list.html')) {
                    renderMyList();
                }
            }
        }
    } else if (button.classList.contains('play-btn')) {
        // Add to watch history when play is clicked
        if (!watchHistory.find(item => item.id === id)) {
            const date = new Date().toLocaleDateString();
            watchHistory.push({ id, title, image, date });
            localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
            if (window.location.pathname.includes('profile.html')) {
                renderWatchHistory();
            }
        }
    }
});

// Profile Editing
const profileForm = document.querySelector('#profile-form');
const profileNameDisplay = document.querySelector('#profile-name');
const profileEmailDisplay = document.querySelector('#profile-email');
const profileNameInput = document.querySelector('#profile-name-input');
const editProfileBtn = document.querySelector('.btn-edit-profile');
const profileSettings = document.querySelector('.profile-settings');

if (editProfileBtn && profileSettings) {
    editProfileBtn.addEventListener('click', () => {
        profileSettings.style.display = profileSettings.style.display === 'none' ? 'block' : 'none';
    });
}

if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = profileNameInput.value;
        const newLanguage = document.querySelector('#profile-language').value;
        const newPlayback = document.querySelector('#profile-playback').value;

        if (profileNameDisplay) {
            profileNameDisplay.textContent = newName;
        }

        localStorage.setItem('profile', JSON.stringify({
            name: newName,
            language: newLanguage,
            playback: newPlayback
        }));

        profileSettings.style.display = 'none';
    });

    const cancelBtn = document.querySelector('.btn-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            profileSettings.style.display = 'none';
            const profileData = JSON.parse(localStorage.getItem('profile')) || {
                name: 'User Name',
                language: 'en',
                playback: 'auto'
            };
            profileNameInput.value = profileData.name;
            document.querySelector('#profile-language').value = profileData.language;
            document.querySelector('#profile-playback').value = profileData.playback;
        });
    }
}
// Profile Editing
const profileDetails = document.querySelector('.profile-details');
const btnEditProfile = document.querySelector('.btn-edit-profile');
const profilesettings = document.querySelector('.profile-settings');
const btnSave = document.querySelector('.btn-save');
const btncancel = document.querySelector('.btn-cancel');
var left = 250;

if (btnEditProfile && profileSettings && profileDetails&&btnSave&&btncancel) {
    btnEditProfile.addEventListener('click', () => {
        // Toggle visibility of profile-settings
        if (left === 250) {
            profilesettings.style.display = 'block';
            profilesettings.style.opacity = '1';
            profileDetails.style.left = '0px';
            profileDetails.style.transition = 'left 0.3s ease';
            profilesettings.style.transform = 'translateY(0)';
            left = 0;
        } else {
            profilesettings.style.display = 'none';
            profilesettings.style.opacity = '0';
            profileDetails.style.left = '250px';
            profileDetails.style.transition = 'left 0.3s ease';
            profilesettings.style.transform = 'translateY(20px)';
            left = 250;
        }
    });
    btnSave.addEventListener('click',()=> {
        if (left === 0)
        {
            profilesettings.style.display = 'none';
            profilesettings.style.opacity = '0';
            profileDetails.style.left = '250px';
            profileDetails.style.transition = 'left 0.3s ease';
            profilesettings.style.transform = 'translateY(20px)';
            left = 250;
        }
    })
    btncancel.addEventListener('click',()=> {
        if (left === 0)
        {
            profilesettings.style.display = 'none';
            profilesettings.style.opacity = '0';
            profileDetails.style.left = '250px';
            profileDetails.style.transition = 'left 0.3s ease';
            profilesettings.style.transform = 'translateY(20px)';
            left = 250;
        }
    })
}

const passwordInput = document.getElementById('profile-password-input');
    const togglePassword = document.getElementById('toggle-password');
    const eyeIcon = togglePassword.querySelector('i');

    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      // Toggle eye icon between fa-eye and fa-eye-slash
      eyeIcon.classList.toggle('fa-eye');
      eyeIcon.classList.toggle('fa-eye-slash');
    });

// Load Data on Page Load
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('my-list.html')) {
        renderMyList();
    }

    if (window.location.pathname.includes('profile.html')) {
        renderWatchHistory();
        const profileData = JSON.parse(localStorage.getItem('profile')) || {
            name: 'User Name',
            language: 'en',
            playback: 'auto'
        };
        if (profileNameDisplay) {
            profileNameDisplay.textContent = profileData.name;
        }
        if (profileEmailDisplay) {
            profileEmailDisplay.textContent = 'user@example.com'; // Static for now
        }
        if (profileNameInput) {
            profileNameInput.value = profileData.name;
        }
        if (document.querySelector('#profile-language')) {
            document.querySelector('#profile-language').value = profileData.language;
        }
        if (document.querySelector('#profile-playback')) {
            document.querySelector('#profile-playback').value = profileData.playback;
        }
    }
});