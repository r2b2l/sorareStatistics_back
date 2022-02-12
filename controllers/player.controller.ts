import * as express from 'express';
import PlayerModel from '../models/Player.model';
import ControllerInterface from './controller.interface';
import NotFoundException from '../exceptions/NotFoundException';

class PlayerController implements ControllerInterface {
  public path = '/player';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.delete(this.path + '/:id', this.deletePlayer);
    this.router.get(this.path + '/all', this.getAllPlayers);
    this.router.get(this.path + '/:id', this.getPlayerById);
    this.router.post(this.path, this.createPlayer);
    this.router.patch(this.path + '/:id', this.updatePlayer);
  }

  getAllPlayers(request: express.Request, response: express.Response) {
    PlayerModel.find()
      .then(players => {
        response.send(players);
      })
  }

  getPlayerById(request: express.Request, response: express.Response) {
    const id = request.params.id;
    if (id.length !== 24) {
      throw new NotFoundException('Player', id);
    }
    PlayerModel.findById(id)
      .then(player => {
        if (player) {
          response.send(player);
        } else {
          throw new NotFoundException('Player', id);
        }
      })
  }

  createPlayer = (request: express.Request, response: express.Response) => {
    const postData = request.body;
    const createdPlayer = new PlayerModel(postData);
    createdPlayer.save()
      .then((savedPost) => {
        response.send(savedPost);
      });
  }

  updatePlayer(request: express.Request, response: express.Response) {
    const id = request.params.id;
    const postData = request.body;
    PlayerModel.findByIdAndUpdate(id, postData, { new: true })
      .then(player => {
        if(player) {
          response.send(player);
        } else {
          throw new NotFoundException('Player', id);
        }
      })
  }

  deletePlayer(request: express.Request, response: express.Response) {
    const id = request.params.id;
    PlayerModel.findByIdAndDelete(id)
      .then(successResponse => {
        if (successResponse) {
          response.send(200);
        } else {
          throw new NotFoundException('Player', id);
        }
      })
  }

}

export default PlayerController;