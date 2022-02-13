import * as express from 'express';
import ClubModel from '../models/Club.model';
import ControllerInterface from './controller.interface';
import NotFoundException from '../exceptions/NotFoundException';

class ClubController implements ControllerInterface {
  public path = '/club';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.delete(this.path + '/:id', this.deleteClub);
    this.router.get(this.path + '/all', this.getAllClubs);
    this.router.get(this.path + '/:id', this.getClubById);
    this.router.post(this.path, this.createClub);
    this.router.patch(this.path + '/:id', this.updateClub);
  }

  getAllClubs(request: express.Request, response: express.Response) {
    ClubModel.find()
      .then(clubs => {
        response.send(clubs);
      })
  }

  getClubById(request: express.Request, response: express.Response) {
    const id = request.params.id;
    if (id.length !== 24) {
      throw new NotFoundException('Club', id);
    }
    ClubModel.findById(id)
      .then(club => {
        if (club) {
          response.send(club);
        } else {
          throw new NotFoundException('Club', id);
        }
      })
  }

  createClub = (request: express.Request, response: express.Response) => {
    const postData = request.body;
    const createdClub = new ClubModel(postData);
    createdClub.save()
      .then((savedPost) => {
        response.send(savedPost);
      });
  }

  updateClub(request: express.Request, response: express.Response) {
    const id = request.params.id;
    const postData = request.body;
    ClubModel.findByIdAndUpdate(id, postData, { new: true })
      .then(club => {
        if(club) {
          response.send(club);
        } else {
          throw new NotFoundException('Club', id);
        }
      })
  }

  deleteClub(request: express.Request, response: express.Response) {
    const id = request.params.id;
    ClubModel.findByIdAndDelete(id)
      .then(successResponse => {
        if (successResponse) {
          response.send(200);
        } else {
          throw new NotFoundException('Club', id);
        }
      })
  }

}

export default ClubController;