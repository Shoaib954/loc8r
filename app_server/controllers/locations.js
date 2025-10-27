const locations = [
  {
    _id: 'starcups',
    name: 'Starcups',
    address: '125 High Street, Reading, RG6 1PS',
    rating: 3,
    facilities: ['Hot drinks', 'Food', 'Premium wifi'],
    distance: '100m',
    description: 'Starcups is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.8272226612307!2d78.6534712403193!3d17.420077383541535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb76730bf4dccf%3A0x2ca84b53416f0abd!2sAnurag%20University%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1690526278364!5m2!1sen!2sin',
    reviews: [
      { author: 'Simon Holmes', rating: 5, date: '16 July 2013', text: 'What a great place. I can\'t say enough good things about it.' },
      { author: 'Charlie Chaplin', rating: 3, date: '16 June 2013', text: 'It was okay. Coffee wasn\'t great, but the wifi was fast.' }
    ]
  },
  {
    _id: 'cafe-hero',
    name: 'Cafe Hero',
    address: '125 High Street, Reading, RG6 1PS',
    rating: 4,
    facilities: ['Hot drinks', 'fast food', 'Premium wifi'],
    distance: '200m',
    description: 'Cafe Hero is a great place for coffee and snacks with fast wifi.',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.8272226612307!2d78.6534712403193!3d17.420077383541535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb76730bf4dccf%3A0x2ca84b53416f0abd!2sCafe%20Hero!5e0!3m2!1sen!2sin!4v1690526278364!5m2!1sen!2sin',
    reviews: [
      { author: 'Alice', rating: 4, date: '10 August 2015', text: 'Nice ambiance and good coffee.' },
      { author: 'Bob', rating: 5, date: '12 September 2016', text: 'Loved the snacks and wifi speed.' }
    ]
  },
  {
    _id: 'burger-queen',
    name: 'Burger Queen',
    address: '125 High Street, Reading, RG6 1PS',
    rating: 2,
    facilities: ['Burger', 'Food', 'Premium wifi'],
    distance: '250m',
    description: 'Burger Queen offers tasty food and premium wifi for all customers.',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.8272226612307!2d78.6534712403193!3d17.420077383541535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb76730bf4dccf%3A0x2ca84b53416f0abd!2sBurger%20Queen!5e0!3m2!1sen!2sin!4v1690526278364!5m2!1sen!2sin',
    reviews: [
      { author: 'Eve', rating: 2, date: '5 May 2017', text: 'Food was good, wifi could be better.' },
      { author: 'Mallory', rating: 3, date: '20 June 2018', text: 'Decent place for a quick bite.' }
    ]
  },
  {
    _id: 'tulips',
    name: 'Tulips',
    address: '325 High Street, Reading, RG6 1PS',
    rating: 2,
    facilities: ['Burger', 'Food', 'Premium wifi'],
    distance: '250m',
    description: 'Tulips offers tasty food and premium wifi for all customers.',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.8272226612307!2d78.6534712403193!3d17.420077383541535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb76730bf4dccf%3A0x2ca84b53416f0abd!2sBurger%20Queen!5e0!3m2!1sen!2sin!4v1690526278364!5m2!1sen!2sin',
    reviews: [
      { author: 'Eve', rating: 2, date: '5 May 2017', text: 'Food was good, wifi could be better.' },
      { author: 'Mallory', rating: 3, date: '20 June 2018', text: 'Decent place for a quick bite.' }
    ]
  }
];

module.exports.locationList = function(req, res) {
  res.render('location-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Locator',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
    locations
  });
};
const mongoose = require('mongoose');
const Review = mongoose.model('Review');

module.exports.locationInfo = async function(req, res){
  const location = locations.find(loc => loc._id === req.params.locationid);
  if (!location) {
    return res.status(404).render('error', { title: 'Error', message: 'Location not found', error: {} });
  }
  let reviews = [];
  try {
    reviews = await Review.find({ locationId: location._id }).sort({ date: -1 });
  } catch (err) {
    reviews = location.reviews || [];
  }
  res.render('location-info', {
    title: location.name,
    location,
    reviews,
    mapUrl: location.mapUrl
  });
};
module.exports.addReview = function(req, res){
  res.render('locations-review-form', { 
    title: 'ADD REVIEW', 
    locationId: req.query.locationId || '',
    error: null
  });
};
  
  