import { getDistance } from 'geolib';
import { IResolvers } from 'apollo-server-express';
import axios from 'axios';
import { User } from './types';
import logger from './logger';
const baseUrl = 'https://bpdts-test-app.herokuapp.com';
const london = {
  latitude: 51.50853,
  longitude: -0.12574,
};
const maxDistance = 50;

const getDistanceFromLondon = (latitude: number, longitude: number): number => {
  const metres = getDistance({ ...london }, { latitude, longitude });
  return metres / 1609.34;
};

export const resolvers: IResolvers = {
  Query: {
    londonUsers: async (): Promise<User[]> => {
      try {
        const [livingInLondonUsers, allUsers] = await Promise.all([
          axios.get(`${baseUrl}/city/London/users`),
          axios.get(`${baseUrl}/users`),
        ]);

        const currentlyNearLondonUsers = allUsers.data
          .reduce((res: User[], user: User) => {
            const latitude = parseFloat(user.latitude.toString());
            const longitude = parseFloat(user.longitude.toString());
            const distance = getDistanceFromLondon(latitude, longitude);
            if (distance <= maxDistance) res = [...res, { ...user, distance }];
            return res;
          }, [])
          .sort((a: User, b: User) => a.distance - b.distance);

        const users = [
          ...livingInLondonUsers.data
            .filter(
              (user: User) =>
                !currentlyNearLondonUsers
                  .map(({ email }: { email: string }) => email)
                  .includes(user.email)
            )
            .map((user: User) => ({
              ...user,
              distance: getDistanceFromLondon(user.latitude, user.longitude),
              livesInLondon: true,
            })),
          ...currentlyNearLondonUsers
            .filter(
              (user: User) =>
                !livingInLondonUsers.data
                  .map(({ email }: { email: string }) => email)
                  .includes(user.email)
            )
            .map((user: User) => ({ ...user, livesInLondon: false })),
        ];
        return users;
      } catch (error) {
        logger.info(error.message, error);
        throw new Error(error);
      }
    },
  },
  User: {
    latitude: (user: User): number => parseFloat(user.latitude.toString()),
    longitude: (user: User): number => parseFloat(user.longitude.toString()),
  },
};