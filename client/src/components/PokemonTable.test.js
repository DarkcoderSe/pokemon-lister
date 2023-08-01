import React from 'react';
import { render, screen } from '@testing-library/react';
import PokemonTable from './PokemonTable';

test('renders table with Pokemon data', async () => {
  // Mock the fetchPokemons function to return dummy data
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => [
      { id: 1, name: 'Pikachu', base_experience: 100, height: 30, weight: 12 },
      { id: 2, name: 'Charmander', base_experience: 50, height: 40, weight: 10 },
    ],
  });

  render(<PokemonTable />);

  // Wait for the table to be populated with Pokemon data
  await screen.findByText('Pikachu');
  await screen.findByText('Charmander');

  expect(screen.getByText('Pikachu')).toBeInTheDocument();
  expect(screen.getByText('Charmander')).toBeInTheDocument();
});
