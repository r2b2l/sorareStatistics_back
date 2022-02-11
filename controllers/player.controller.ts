import * as express from 'express';
import PlayerModel from '../models/Player.model';
// import Post from '../models/posts.interface';
 
class PlayerController {
  public path = '/player';
  public router = express.Router();
 
  private player = [
    {
      name: 'Mbappe'
    }
  ];
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.get(this.path, this.getPlayer);
    // this.router.post(this.path, this.createAPost);
  }
 
  getPlayer = (request: express.Request, response: express.Response) => {
    response.send(this.player);
  }

  createPlayer = (request: express.Request, response: express.Response) => {
    const postData = request.body;
    const createdPlayer = new PlayerModel(postData);
    createdPlayer.save()
      .then((savedPost) => {
        response.send(savedPost);
      });
  }

}
 
export default PlayerController;