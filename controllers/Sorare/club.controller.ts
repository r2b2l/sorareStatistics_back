import * as express from 'express';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
import ClubModel from '../../models/Sorare/Club.model';
import ControllerInterface from '../controller.interface';
import NotFoundException from '../../exceptions/NotFoundException';

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
    this.router.get(this.path + '/myClub', this.getMyClub);
    this.router.get(this.path + '/:id', this.getClubById);
    this.router.post(this.path, this.createClub);
    this.router.patch(this.path + '/:id', this.updateClub);
  }

  hello(request: express.Request, response: express.Response) {
    response.send('coucou');
  }

  async login(request: express.Request, response: express.Response) {
    // Connect to Sorare
    const email = process.env.SORARE_MAIL;

    try {
      const saltResponse = await axios.get('https://api.sorare.com/api/v1/users/' + email);
      const saltData = saltResponse.data;

      console.log(saltData);

      const hash = bcrypt.hashSync(process.env.SORARE_PASS, saltData.salt);
      console.log(hash);
      const url = process.env.SORARE_GRAPHQL_URL;
          const SignInMutation = `
            mutation SignInMutation($input: signInInput!) {
              signIn(input: $input) {
                currentUser {
                  slug
                  jwtToken(aud: "Statistics_API") {
                    token
                    expiredAt
                  }
                }
                otpSessionChallenge
                errors {
                  code
                  message
                  path
                }
              }
            }
        `;

          const variables = {
            input: {
              email: process.env.SORARE_MAIL,
              password: hash
            },
          }


          axios({
            url,
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              query: SignInMutation,
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
              response.send(error.code);
            });
    } catch (error) {
      console.error('Error lors de la requete du Salt :', error);
      response.send(error.code);
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

  async getMyClub(request: express.Request, response: express.Response) {


    // const query = `
    //   query {
    //     // Votre requête GraphQL ici
    //   }
    // `;

    // try {
    //   const AxResponse = await axios.post(url, { query });
    //   const data = AxResponse.data.data; // Les données de réponse
    //   console.log(data);
    //   response.send(data);
    // } catch (error) {
    //   console.error('Erreur lors de la requête GraphQL :', error);
    // }
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