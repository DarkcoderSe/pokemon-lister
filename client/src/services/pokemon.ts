import api from "../api";
import { PokemonGetParam } from "../interfaces";
import { AxiosResponse } from "axios";

export const getPokemons = async (params: PokemonGetParam): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await api.get(`pokemons`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
