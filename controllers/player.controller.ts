import * as express from 'express';
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

}
 
export default PlayerController;