import PlayerController from './controllers/player.controller';
import App from './app';
import PostsController from './controllers/posts.controller';
import 'dotenv/config';

const app = new App(
  [
    new PostsController(),
    new PlayerController()
  ],
  process.env.PORT,
);

app.connectDatabase();
 
app.listen();