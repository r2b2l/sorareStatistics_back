import * as express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import PlayerModel from '../../models/Sorare/Player.model';
import ControllerInterface from '../controller.interface';
import NotFoundException from '../../exceptions/NotFoundException';
import validationMiddleware from '../../middleware/validation.middleware';
import PlayerDto from '../../models/Sorare/Player.dto';
import { QPLAYERINFOS } from '../../utills/sorare/graphql/queries';

/**
 * Player Controller
 */
class PlayerController implements ControllerInterface {
  public path = '/sorare/player';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  /**
   * Initiate all player routes 
   */
  public intializeRoutes() {
    this.router.delete(this.path + '/:id', this.deletePlayer);
    this.router.get(this.path + '/all', this.getAllPlayers);
    this.router.get(this.path + '/name/:name', this.getPlayersByName);
    this.router.get(this.path + '/slug/:slug', this.getPLayerBySlug);
    this.router.get(this.path + '/:id', this.getPlayerById);
    this.router.post(this.path, validationMiddleware(PlayerDto), this.createPlayer);
    this.router.patch(this.path + '/:id', validationMiddleware(PlayerDto, true), this.updatePlayer);
  }

  /**
   * Get all players
   * @param response 
   */
  getAllPlayers(response: express.Response) {
    PlayerModel.find()
      .then(players => {
        response.send(players);
      })
  }

  /**
   * Get player infos through Sorare's API
   * @param request
   * @param response
   */
  async getPLayerBySlug(request: express.Request, response: express.Response) {
    const url = process.env.SORARE_GRAPHQL_FEDERATION_URL;
    const slug = request.params.slug;
    const variables = {
      "slug": slug
    };

    // Perform Player infos request
    await axios({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'SORARE_APIKEY': process.env.SORARE_API_KEY,
        'Authorization': 'Bearer ' + process.env.SORARE_JWT_TOKEN,
        'JWT-AUD': process.env.SORARE_JWT_AUD
      },
      data: {
        query: QPLAYERINFOS,
        variables
      }
    })
    .then((playerResponse) => {
      response.send(playerResponse.data);
    })
    .catch((error) => {
      console.error('Erreur lors de la query GraphQL :' + error);
      response.send(error);
    })
  }

  getPlayersByName(request: express.Request, response: express.Response) {
    const name = request.params.name;
    PlayerModel.find({name: {$regex: name, $options: 'i'}}).limit(5)
      .then(async players => {
        if (players) {
          response.send(players);
        } else {
          throw new NotFoundException('Player', name);
        }
      })
  }

  getPlayerById(request: express.Request, response: express.Response) {
    const id = request.params.id;
    if (id.length !== 24) {
      throw new NotFoundException('Player', id);
    }
    // PlayerModel.findById(id)
    //   .then(async player => {
    //     if (player) {
    //       await player.populate('club').execPopulate() // possible de mettre plusieurs colonne dans populate
    //       response.send(player);
    //     } else {
    //       throw new NotFoundException('Player', id);
    //     }
    //   })
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