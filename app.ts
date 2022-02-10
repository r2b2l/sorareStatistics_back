import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'node:path';
// import http from 'http';
// import campagneMarketingRouter from './routes/campagnemarketing';
// import userRoutes from './routes/user';
// import vuecampagneRoutes from './routes/vuescampagne';
const app = express();

// const env = require('./environment');

// export default class App {
//     createServer() {
//         return http.createServer(app);
//     }
//     setPort() {
//         app.set('port', 3000);
//     }
// }

mongoose.connect('mongodb+srv://yanisbannier:yanisbannier@cluster0.ppnls.mongodb.net/test?retryWrites=true&w=majority', // PROD
    // mongoose.connect('mongodb+srv://erwanmartin:erwanmartin@cluster0.h97pf.mongodb.net/commandgo?retryWrites=true&w=majority', // DEV
    // mongoose.connect(environment.environment.mongoHost + '?retryWrites=true&w=majority',
    // mongoose.connect(environment.mongoHostDev + '?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(
        // () => console.log('Connexion à MongoDB réussie !')
    )
    .catch(
        // () => console.log('Connexion à MongoDB échouée !')
    );


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/**
 * Config générale app Express
 */
app.use(bodyParser.json());

// useless
app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use(express.static(path.join(__dirname, '/frontend/dist/frontend/')));

/**
 * ROUTING
 */
app.get('/', (request, response) => {
    response.send('Hello');
});
// app.use('/api/campagnemarketing', campagneMarketingRouter);
// app.use('/api/auth', userRoutes);
// app.use('/api/vuescampagne', vuecampagneRoutes);


app.post('');

app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, '/frontend/dist/frontend/index.html'))
});

module.exports = app;