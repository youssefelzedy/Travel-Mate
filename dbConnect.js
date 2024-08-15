const mongoose = require('mongoose');
const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log('database connected\n ------------------------------------------');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = dbConnect