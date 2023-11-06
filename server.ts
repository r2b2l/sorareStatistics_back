import PlayerController from './controllers/Sorare/player.controller';
import ClubController from './controllers/Sorare/club.controller';
import UserController from './controllers/app/user.controller';
import App from './app';
import 'dotenv/config';

const app = new App(
  [
    new PlayerController(),
    new ClubController(),
    new UserController()
  ],
  process.env.PORT,
);

app.connectDatabase();

app.listen();