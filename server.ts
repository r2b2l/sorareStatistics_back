import PlayerController from './controllers/player.controller';
import App from './app';
import PostsController from './controllers/posts.controller';
 
const app = new App(
  [
    new PostsController(),
    new PlayerController()
  ],
  3000,
);
 
app.listen();