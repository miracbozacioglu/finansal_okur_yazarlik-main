// ===== Sayfayı yüklemede kullanıcı durumunu kontrol et =====
document.addEventListener('DOMContentLoaded', function() {
    checkUserStatus();
});

// ===== Kullanıcı Durumunu Kontrol Et =====
function checkUserStatus() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        // Kullanıcı giriş yapmışsa
        const user = JSON.parse(currentUser);
        showUserInfo(user);
        // Korumalı bölümleri göster
        showProtectedSections();
    } else {
        // Kullanıcı giriş yapmamışsa
        showLoginLinks();
        // Korumalı bölümleri gizle
        hideProtectedSections();
    }
}

function showUserInfo(user) {
    document.getElementById('nav-auth-links').style.display = 'none';
    document.getElementById('nav-user-info').style.display = 'flex';
    document.getElementById('user-display-name').textContent = user.name + ' ' + user.surname;
    
    // Profil resmini yükle
    if (user.profilePic) {
        document.getElementById('nav-profile-pic').src = user.profilePic;
        document.getElementById('profile-image-display').src = user.profilePic;
    }
}

function showLoginLinks() {
    document.getElementById('nav-auth-links').style.display = 'flex';
    document.getElementById('nav-user-info').style.display = 'none';
}

// ===== KORUMANLI BÖLÜMLER =====
function hideProtectedSections() {
    const sections = document.querySelectorAll('#cozumler, #video-akademi, #egitim');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

function showProtectedSections() {
    const sections = document.querySelectorAll('#cozumler, #video-akademi, #egitim');
    sections.forEach(section => {
        section.style.display = 'block';
    });
    // Video container başlığını da göster
    const videoContainer = document.querySelector('.video-container-section');
    if (videoContainer) {
        videoContainer.style.display = 'block';
    }
}

// ===== KORUMANLI BÖLÜMLERE ERİŞİM KONTROLÜ =====
function checkProtectedAccess(event) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        event.preventDefault();
        alert('Lütfen önce giriş yapın!');
        showLoginForm();
        return false;
    }
    return true;
}

// ===== KAYIT MODAL FONKSİYONLARI =====
function showRegistrationForm(event) {
    if (event) event.preventDefault();
    document.getElementById('registrationModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeRegistrationForm() {
    document.getElementById('registrationModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('registrationForm').reset();
}

function handleRegistration(event) {
    event.preventDefault();
    
    const name = document.getElementById('reg-name').value.trim();
    const surname = document.getElementById('reg-surname').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;

    // Validasyonlar
    if (!name || !surname || !username || !password) {
        alert('Lütfen tüm alanları doldurun!');
        return;
    }

    if (password.length < 6) {
        alert('Şifre en az 6 karakter olmalıdır!');
        return;
    }

    if (password !== passwordConfirm) {
        alert('Şifreler eşleşmiyor!');
        return;
    }

    // Kullanıcı adı kontrol et
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.username === username)) {
        alert('Bu kullanıcı adı zaten kullanılıyor!');
        return;
    }

    // Yeni kullanıcı oluştur
    const newUser = {
        id: Date.now(),
        name: name,
        surname: surname,
        username: username,
        password: password, // Not: Gerçek uygulamada şifre şifrelenmelidir!
        profilePic: null
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('✅ Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
    closeRegistrationForm();
    
    // Giriş formunu aç
    setTimeout(() => {
        showLoginForm();
    }, 500);
}

// ===== GİRİŞ MODAL FONKSİYONLARI =====
function showLoginForm(event) {
    if (event) event.preventDefault();
    
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        alert('Zaten giriş yapmış durumdasınız!');
        return;
    }
    
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginForm() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('loginForm').reset();
    document.getElementById('quickRegisterForm').reset();
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('register-error').style.display = 'none';
    switchLoginTab('login'); // Varsayılan olarak giriş tabına dön
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    if (!username || !password) {
        errorDiv.textContent = 'Lütfen tüm alanları doldurun!';
        errorDiv.style.display = 'block';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        errorDiv.textContent = '❌ Kullanıcı adı veya şifre hatalı!';
        errorDiv.style.display = 'block';
        document.getElementById('login-password').value = '';
        return;
    }

    // Giriş başarılı
    const userInfo = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        username: user.username,
        profilePic: user.profilePic || null
    };

    localStorage.setItem('currentUser', JSON.stringify(userInfo));
    alert('✅ Hoşgeldiniz, ' + user.name + '!');
    closeLoginForm();
    checkUserStatus();
    // Sayfayı yukarı scroll et
    window.scrollTo(0, 0);
}

// ===== ÇIKIŞ FONKSİYONU =====
function logout(event) {
    if (event) event.preventDefault();
    
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserId');
        alert('✅ Başarıyla çıkış yaptınız.');
        closeProfileModal();
        checkUserStatus();
        // Sayfayı yukarı scroll et
        window.scrollTo(0, 0);
    }
}

// ===== GİRİŞ VE KAYIT SEKMELERİ ARASINDA GEÇİŞ =====
function switchLoginTab(tab) {
    const loginContent = document.getElementById('login-tab-content');
    const registerContent = document.getElementById('register-tab-content');
    const loginBtn = document.getElementById('tab-login-btn');
    const registerBtn = document.getElementById('tab-register-btn');
    
    if (tab === 'login') {
        loginContent.style.display = 'block';
        registerContent.style.display = 'none';
        loginBtn.style.color = '#1e88e5';
        loginBtn.style.borderBottomColor = '#1e88e5';
        registerBtn.style.color = '#999';
        registerBtn.style.borderBottomColor = 'transparent';
        document.getElementById('login-error').style.display = 'none';
    } else {
        loginContent.style.display = 'none';
        registerContent.style.display = 'block';
        loginBtn.style.color = '#999';
        loginBtn.style.borderBottomColor = 'transparent';
        registerBtn.style.color = '#1e88e5';
        registerBtn.style.borderBottomColor = '#1e88e5';
        document.getElementById('register-error').style.display = 'none';
    }
}

// ===== HIZLI KAYIT FONKSİYONU (Login Modal içinden) =====
function handleQuickRegistration(event) {
    event.preventDefault();
    
    const name = document.getElementById('quick-reg-name').value.trim();
    const surname = document.getElementById('quick-reg-surname').value.trim();
    const username = document.getElementById('quick-reg-username').value.trim();
    const password = document.getElementById('quick-reg-password').value;
    const passwordConfirm = document.getElementById('quick-reg-password-confirm').value;
    const errorDiv = document.getElementById('register-error');

    // Validasyonlar
    if (!name || !surname || !username || !password) {
        errorDiv.textContent = 'Lütfen tüm alanları doldurun!';
        errorDiv.style.display = 'block';
        return;
    }

    if (password.length < 6) {
        errorDiv.textContent = 'Şifre en az 6 karakter olmalıdır!';
        errorDiv.style.display = 'block';
        return;
    }

    if (password !== passwordConfirm) {
        errorDiv.textContent = 'Şifreler eşleşmiyor!';
        errorDiv.style.display = 'block';
        return;
    }

    // Kullanıcı adı benzersizliği kontrol et
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.username === username)) {
        errorDiv.textContent = 'Bu kullanıcı adı zaten kullanılıyor!';
        errorDiv.style.display = 'block';
        return;
    }

    // Yeni kullanıcı oluştur
    const newUser = {
        id: Date.now(),
        name: name,
        surname: surname,
        username: username,
        password: password,
        profilePic: null
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('✅ Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
    document.getElementById('quickRegisterForm').reset();
    
    // Giriş tabına dön
    switchLoginTab('login');
}

// ===== KAYIT VE GİRİŞ FORM GEÇİŞİ =====
function switchToRegistration(event) {
    event.preventDefault();
    closeLoginForm();
    setTimeout(() => {
        showRegistrationForm();
    }, 300);
}

// ===== PROFIL MODAL FONKSİYONLARI =====
function showProfileModal(event) {
    if (event) event.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('profile-username').value = currentUser.username;
        document.getElementById('profileModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        document.getElementById('profile-error').style.display = 'none';
        document.getElementById('profile-success').style.display = 'none';
    }
}

function closeProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('profile-current-password').value = '';
    document.getElementById('profile-new-password').value = '';
    document.getElementById('profile-new-password-confirm').value = '';
    document.getElementById('profile-error').style.display = 'none';
    document.getElementById('profile-success').style.display = 'none';
}

function updateProfilePicture(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result;
            
            // Resmi ekranda göster
            document.getElementById('profile-image-display').src = base64;
            document.getElementById('nav-profile-pic').src = base64;
            
            // localStorage'a kaydet
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            currentUser.profilePic = base64;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // users dizisinde de güncelle
            const users = JSON.parse(localStorage.getItem('users'));
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].profilePic = base64;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            showProfileSuccess('Profil resimi başarıyla yüklendi!');
        };
        reader.readAsDataURL(file);
    }
}

function updateProfile() {
    const currentPassword = document.getElementById('profile-current-password').value;
    const newPassword = document.getElementById('profile-new-password').value;
    const newPasswordConfirm = document.getElementById('profile-new-password-confirm').value;
    const errorDiv = document.getElementById('profile-error');
    const successDiv = document.getElementById('profile-success');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Mevcut şifre kontrol et
    if (!currentPassword) {
        errorDiv.textContent = 'Lütfen mevcut şifrenizi girin!';
        errorDiv.style.display = 'block';
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.id === currentUser.id);
    
    if (!user || user.password !== currentPassword) {
        errorDiv.textContent = '❌ Mevcut şifre hatalı!';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Şifre değişikliği yapılacaksa
    if (newPassword) {
        if (newPassword.length < 6) {
            errorDiv.textContent = 'Yeni şifre en az 6 karakter olmalıdır!';
            errorDiv.style.display = 'block';
            return;
        }
        
        if (newPassword !== newPasswordConfirm) {
            errorDiv.textContent = 'Yeni şifreler eşleşmiyor!';
            errorDiv.style.display = 'block';
            return;
        }
        
        // Şifreyi güncelle
        user.password = newPassword;
        users[users.findIndex(u => u.id === currentUser.id)] = user;
        localStorage.setItem('users', JSON.stringify(users));
        
        successDiv.textContent = '✅ Şifreniz başarıyla değiştirildi!';
        successDiv.style.display = 'block';
        
        // Formu temizle
        setTimeout(() => {
            document.getElementById('profile-current-password').value = '';
            document.getElementById('profile-new-password').value = '';
            document.getElementById('profile-new-password-confirm').value = '';
        }, 1000);
    } else {
        successDiv.textContent = '✅ Profil güncellendi!';
        successDiv.style.display = 'block';
    }
}

function showProfileSuccess(message) {
    const successDiv = document.getElementById('profile-success');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

// ===== MODAL DIŞINA TIKLANINCA KAPAT =====
document.addEventListener('DOMContentLoaded', function() {
    const registrationModal = document.getElementById('registrationModal');
    const loginModal = document.getElementById('loginModal');
    const profileModal = document.getElementById('profileModal');

    if (registrationModal) {
        registrationModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeRegistrationForm();
            }
        });
    }

    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLoginForm();
            }
        });
    }

    if (profileModal) {
        profileModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeProfileModal();
            }
        });
    }
});