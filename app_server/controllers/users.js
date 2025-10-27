const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');

// Register new user
module.exports.register = async function(req, res) {
    const { username, email, password, confirmPassword } = req.body;
    
    console.log('Registration attempt:', { username, email });
    
    if (!username || !email || !password || !confirmPassword) {
        return res.render('register', { title: 'Register', error: 'All fields required.' });
    }
    if (password !== confirmPassword) {
        return res.render('register', { title: 'Register', error: 'Passwords do not match.' });
    }
    
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            const error = existingUser.username === username ? 'Username already exists.' : 'Email already exists.';
            return res.render('register', { title: 'Register', error });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        const savedUser = await user.save();
        
        console.log('User registered successfully:', savedUser._id);
        return res.redirect('/signin?success=registered');
        
    } catch (err) {
        console.error('Registration error:', err);
        return res.render('register', { title: 'Register', error: 'Database error. Please try again.' });
    }
};

// Login user
module.exports.login = async function(req, res) {
    const { username, password } = req.body;
    
    console.log('Login attempt:', username);
    
    if (!username || !password) {
        return res.render('signin', { title: 'Login', error: 'All fields required.' });
    }
    
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.render('signin', { title: 'Login', error: 'Invalid username or password.' });
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log('Password mismatch for user:', username);
            return res.render('signin', { title: 'Login', error: 'Invalid username or password.' });
        }
        
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.isAdmin = !!user.isAdmin;
        
        console.log('Login successful:', username);
        return res.redirect('/');
        
    } catch (err) {
        console.error('Login error:', err);
        return res.render('signin', { title: 'Login', error: 'Database error. Please try again.' });
    }
};
