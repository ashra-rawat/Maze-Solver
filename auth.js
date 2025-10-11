// Simple Authentication System for Maze Solver

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth.js loaded successfully');
    
    // Get DOM elements
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const welcomeUser = document.getElementById('welcome-user');
    const loginMessage = document.getElementById('login-message');
    
    console.log('Login button found:', loginBtn);
    
    // Fixed credentials
    const VALID_USERNAME = 'admin';
    const VALID_PASSWORD = 'maze123';
    
    // Handle login button click
    loginBtn.addEventListener('click', handleLogin);
    console.log('Login button event listener added');
    
    // Handle Enter key in password field
    document.getElementById('login-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    // Handle Enter key in username field
    document.getElementById('login-username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    // Login function
    function handleLogin() {
        console.log('Login button clicked!');
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        console.log('Username:', username, 'Password:', password);
        
        if (!username || !password) {
            loginMessage.textContent = 'Please enter both username and password';
            return;
        }
        
        // Check credentials (admin/maze123)
        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            console.log('Login successful!');
            // Hide login screen and show app screen
            loginScreen.classList.remove('active');
            appScreen.classList.add('active');
            
            // Update welcome message
            welcomeUser.textContent = `Welcome, ${username}!`;
            loginMessage.textContent = '';
            
            // Initialize maze
            if (typeof initMaze === 'function') {
                initMaze();
            }
        } else {
            loginMessage.textContent = 'Invalid username or password';
        }
    }
    
    // Logout button click handler
    logoutBtn.addEventListener('click', function() {
        // Show login screen and hide app screen
        appScreen.classList.remove('active');
        loginScreen.classList.add('active');
        
        // Clear form and reset to default values
        document.getElementById('login-username').value = 'admin';
        document.getElementById('login-password').value = 'maze123';
        loginMessage.textContent = '';
    });
});
