const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground')

//connecting to mongoDb
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to MongoDB!');
});
db.on('error', (err) => {
    console.log('Connection error:', err);
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random150 = Math.floor(Math.random() * 150);
        const price = Math.floor(Math.random() * 1000) + 500;
        const camp = new Campground({
            location: `${cities[random150].city}, ${cities[random150].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,

            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            author: '688e1661f0264500c7130527',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random150].longitude,
                    cities[random150].latitude
                 ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/ddnm1sdvw/image/upload/v1755007138/YelpCamp/g4mdigvxm2yxb3b9yjap.jpg',
                    filename: 'YelpCamp/g4mdigvxm2yxb3b9yjap',

                }
            ],
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

