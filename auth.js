// Authentication system for Maze Solver
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const welcomeUser = document.getElementById('welcome-user');
    const loginMessage = document.getElementById('login-message');
    
    // Show register form
    showRegisterLink.addEventListener('click', function() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginMessage.textContent = '';
    });
    
    // Show login form
    showLoginLink.addEventListener('click', function() {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        loginMessage.textContent = '';
    });
    
    // Login functionality
    loginBtn.addEventListener('click', function() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            loginMessage.textContent = 'Please enter both username and password';
            return;
        }
        
        // Simple authentication (in a real app, this would connect to a backend)
        const users = JSON.parse(localStorage.getItem('mazeUsers') || '{}');
        
        if (users[username] && users[username].password === password) {
            // Successful login
            localStorage.setItem('currentUser', username);
            showAppScreen(username);
        } else {
            loginMessage.textContent = 'Invalid username or password';
        }
    });
    
    // Register functionality
    registerBtn.addEventListener('click', function() {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (!username || !password || !confirmPassword) {
            loginMessage.textContent = 'Please fill in all fields';
            return;
        }
        
        if (password !== confirmPassword) {
            loginMessage.textContent = 'Passwords do not match';
            return;
        }
        
        if (password.length < 4) {
            loginMessage.textContent = 'Password must be at least 4 characters';
            return;
        }
        
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('mazeUsers') || '{}');
        
        if (users[username]) {
            loginMessage.textContent = 'Username already exists';
            return;
        }
        
        // Register new user
        users[username] = { password: password };
        localStorage.setItem('mazeUsers', JSON.stringify(users));
        
        // Auto login after registration
        localStorage.setItem('currentUser', username);
        showAppScreen(username);
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        showLoginScreen();
    });
    
    // Show app screen
    function showAppScreen(username) {
        welcomeUser.textContent = 'Welcome, ${username}!';
        loginScreen.classList.remove('active');
        appScreen.classList.add('active');
        
        // Initialize maze after login
        if (typeof initMaze === 'function') {
            initMaze();
        }
    }
    
    // Show login screen
    function showLoginScreen() {
        appScreen.classList.remove('active');
        loginScreen.classList.add('active');
        
        // Clear form fields
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('register-username').value = '';
        document.getElementById('register-password').value = '';
        document.getElementById('confirm-password').value = '';
        loginMessage.textContent = '';
        
        // Show login form by default
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    }
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        showAppScreen(currentUser);
    } else {
        showLoginScreen();
    }
});