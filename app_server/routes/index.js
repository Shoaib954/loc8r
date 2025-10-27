var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlothers = require('../controllers/others');
var ctrlmain = require('../controllers/main');
var ctrlusers = require('../controllers/users');
const mongoose = require('mongoose');

// Simple admin authentication middleware
function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.status(403).render('error', { title: 'Forbidden', message: 'Admin access only', error: {} });
}

// Admin dashboard route
router.get('/admin', requireAdmin, async function(req, res) {
    const mongoose = require('mongoose');
    const Location = mongoose.model('Location');
    const Review = mongoose.model('Review');
    const User = mongoose.model('User');
    let locations = [], reviews = [], users = [], error = null;
    try {
        locations = await Location.find({});
        reviews = await Review.find({});
        users = await User.find({});
    } catch (err) {
        error = 'Failed to load admin data.';
    }
    res.render('admin-dashboard', { title: 'Admin Dashboard', locations, reviews, users, error });
});
router.post('/admin/add-location', requireAdmin, async function(req, res) {
    const mongoose = require('mongoose');
    const Location = mongoose.model('Location');
    const { name, address, facilities, description } = req.body;
    try {
        await Location.create({
            name,
            address,
            facilities: facilities.split(',').map(f => f.trim()),
            description
        });
        res.redirect('/admin');
    } catch (err) {
        res.redirect('/admin?error=Failed to add location');
    }
});

// Delete location (admin only)
router.post('/admin/delete-location/:id', requireAdmin, async function(req, res) {
    const mongoose = require('mongoose');
    const Location = mongoose.model('Location');
    try {
        await Location.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        res.redirect('/admin?error=Failed to delete location');
    }
});

// Delete review (admin only)
router.post('/admin/delete-review/:id', requireAdmin, async function(req, res) {
    const mongoose = require('mongoose');
    const Review = mongoose.model('Review');
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        res.redirect('/admin?error=Failed to delete review');
    }
});

// Promote/demote user to admin (admin only)
router.post('/admin/set-admin/:id', requireAdmin, async function(req, res) {
    const mongoose = require('mongoose');
    const User = mongoose.model('User');
    const { isAdmin } = req.body;
    try {
        await User.findByIdAndUpdate(req.params.id, { isAdmin: isAdmin === 'true' });
        res.redirect('/admin');
    } catch (err) {
        res.redirect('/admin?error=Failed to update user');
    }
});
// Show review form for a specific location
router.get('/locations/:locationid/review', function(req, res) {
    res.render('locations-review-form', {
        title: 'ADD REVIEW',
        locationId: req.params.locationid
    });
});

// Show all reviews from all locations
router.get('/all-reviews', async function(req, res) {
    try {
        const mongoose = require('mongoose');
        const Review = mongoose.model('Review');
        const reviews = await Review.find({}).sort({ date: -1 });
        res.render('all-reviews', { title: 'All Reviews', reviews, error: null });
    } catch (err) {
        res.render('all-reviews', { title: 'All Reviews', reviews: [], error: 'Failed to fetch reviews.' });
    }
});

// Logout route
router.get('/logout', function(req, res) {
    req.session.destroy(function() {
        res.redirect('/');
    });
});

// Profile route
router.get('/profile', function(req, res) {
    if (!req.session.username) {
        return res.redirect('/signin');
    }
    res.render('profile', {
        title: 'Profile',
        username: req.session.username,
        email: req.session.email
    });
});
 
router.get('/', ctrlLocations.locationList); 
router.get('/locations', ctrlLocations.locationList); 
router.get('/locations/:locationid', ctrlLocations.locationInfo);
router.get('/review', ctrlLocations.addReview);

router.post('/review', async function(req, res) {
    const { name, email, rating, review, locationId } = req.body;
    if (!name || !email || !rating || !review || !locationId) {
        return res.render('locations-review-form', { title: 'ADD REVIEW', error: 'All fields required.' });
    }
    try {
        const Review = mongoose.model('Review');
        await Review.create({
            locationId,
            author: name,
            email,
            rating: parseInt(rating),
            text: review
        });
        return res.redirect('/locations/' + locationId);
    } catch (err) {
        return res.render('locations-review-form', { title: 'ADD REVIEW', error: 'Failed to save review.' });
    }
});
 
router.get('/about', ctrlothers.about); 
 
router.get('/signin', function(req, res, next) {
    res.render('signin', { title: 'Login', error: null });
});
router.get('/register', function(req, res, next) { 
    res.render('register', { title: 'Register', error: null }); 
});
router.post('/register', ctrlusers.register);

router.post('/signin', ctrlusers.login);

module.exports = router;