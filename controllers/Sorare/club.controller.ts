import * as express from 'express';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
import ClubModel from '../../models/Sorare/Club.model';
import ControllerInterface from '../controller.interface';
import NotFoundException from '../../exceptions/NotFoundException';
import { QALLCARDSFROMUSER, QSINGLECARD } from '../../utills/sorare/graphql/queries';
import { MSIGNIN } from '../../utills/sorare/graphql/mutations';

class ClubController implements ControllerInterface {
  public path = '/sorare/club';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.delete(this.path + '/:id', this.deleteClub);
    this.router.get(this.path + '/all', this.getAllClubs);
    this.router.get(this.path + '/login', this.login);
    this.router.get(this.path + '/myClub/cards', this.getMyClubCards);
    this.router.get(this.path + '/:id', this.getClubById);
    this.router.get(this.path + '/card/:slug', this.getCard);
    this.router.post(this.path, this.createClub);
    this.router.patch(this.path + '/:id', this.updateClub);
  }

  /**
   * Perform a login to Sorare API
   * Todo: Déplacer cette route ailleurs une fois le module adapté créé
   * @param request
   * @param response
   */
  async login(request: express.Request, response: express.Response) {
    const email = process.env.SORARE_MAIL;

    try {
      // Get saltKey from Sorare
      const saltResponse = await axios.get('https://api.sorare.com/api/v1/users/' + email);
      const saltData = saltResponse.data;
      const hashedPassword = bcrypt.hashSync(process.env.SORARE_PASS, saltData.salt);

      // Second call, perform Sign in
      const url = process.env.SORARE_GRAPHQL_URL;
      const variables = {
        input: {
          "email": process.env.SORARE_MAIL,
          "password": hashedPassword
        },
      }

      axios({
        url,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          query: MSIGNIN,
          variables,
        },
      })
        .then((AxLoginResponse) => {
          const loginData = AxLoginResponse.data;
          console.log(loginData);
          response.send(loginData);
        })
        .catch((error) => {
          console.error('Erreur lors de la mutation GraphQL :', error.code);
          response.send(error);
        });
    } catch (error) {
      console.error('Error lors de la requete du Salt :', error);
      response.send(error);
    }
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

  /**
   * Get the cards linked to logged account
   * @param request
   * @param response
   * @returns array
   */
  async getMyClubCards(request: express.Request, response: express.Response) {
    const url = process.env.SORARE_GRAPHQL_FEDERATION_URL;
    let cursor = null;
    const cards: any[] = [];

    do {
      const variables = {
        "slug": 'r2b2l',
        "cursor": cursor
      };

      // Get cards until the cursor and store them in array
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
          query: QALLCARDSFROMUSER,
          variables
        },
      })
        .then((currentUserResponse) => {
          currentUserResponse.data.data.user.paginatedCards.nodes.forEach((item) => {
            cards.push(item);
          });
          cursor = currentUserResponse.data.data.user.paginatedCards.pageInfo.endCursor;
        })
        .catch((error) => {
          console.error('Erreur lors de la query GraphQL :', error);
          response.send(error);
        });
    }
    while (cursor != null);

    response.send(cards);
  }

  async getCard(request: express.Request, response: express.Response) {
    const url = process.env.SORARE_GRAPHQL_FEDERATION_URL;
    const slug = request.params.slug;
    const variables = {
      "slugs": [slug]
    };

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
        query: QSINGLECARD,
        variables
      }
    })
    .then((cardResponse) => {
      response.send(cardResponse.data);
    })
    .catch((error) => {
      console.error('Erreur lors de la query GraphQL :' + error);
      response.send(error);
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
        if (club) {
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