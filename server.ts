import PlayerController from './controllers/Sorare/player.controller';
import ClubController from './controllers/Sorare/club.controller';
import App from './app';
import 'dotenv/config';

const app = new App(
  [
    new PlayerController(),
    new ClubController()
  ],
  process.env.PORT,
);

// app.connectDatabase();

app.listen();