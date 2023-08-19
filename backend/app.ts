import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const start = async () => {
    if (!process.env.MONGO_URL) throw new Error('MONGO_URL required!');
    
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (err) {
        throw new Error('Database Error')
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

start()

