import PlayerController from './controllers/player.controller';
import ClubController from './controllers/club.controller';
import App from './app';
import 'dotenv/config';

const app = new App(
  [
    new PlayerController(),
    new ClubController()
  ],
  process.env.PORT,
);

app.connectDatabase();

app.listen();