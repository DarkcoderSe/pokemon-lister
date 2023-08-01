import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Slider } from '@mui/material';


interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  image_url: string;
}

interface Filters {
  base_experience?: number;
  height?: number;
  weight?: number;
}

const PokemonTable: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sorting, setSorting] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({});
  const [totalPages, setTotalPages] = useState<number>(0); // Add the totalPages state


  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/pokemons`, {
          params: {
            page,
            per_page: perPage,
            sort_by: sorting,
            name: searchTerm,
            ...filters,
          },
        });
        setPokemons(response.data.items);
        setTotalPages(response.data.total_pages); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPokemons();
  }, [page, perPage, searchTerm, sorting, filters]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSortChange = (property: string) => {
    setSorting(property);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (property: string, value: number) => {
    setFilters((prevFilters) => ({ ...prevFilters, [property]: value }));
  };

  const renderTableRows = () => {
    return pokemons.map((pokemon) => (
      <TableRow key={pokemon.id}>
        <TableCell>{pokemon.name}</TableCell>
        <TableCell>{pokemon.base_experience}</TableCell>
        <TableCell>{pokemon.height}</TableCell>
        <TableCell>{pokemon.weight}</TableCell>
        <TableCell>
          <img src={pokemon.image_url} alt={pokemon.name} style={{ width: 100, height: 100 }} />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      <TextField
        label="Search by name"
        value={searchTerm}
        onChange={handleSearchChange}
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={() => setFilters({})}>
        Clear Filters
      </Button>
      <div>
        <div>
          <span>Base Experience:</span>
          <Slider
            value={filters.base_experience || 0}
            min={0}
            max={500}
            onChange={(event, value) => handleFilterChange('base_experience', value as number)}
            valueLabelDisplay="auto"
          />
        </div>
        <div>
          <span>Height:</span>
          <Slider
            value={filters.height || 0}
            min={0}
            max={300}
            onChange={(event, value) => handleFilterChange('height', value as number)}
            valueLabelDisplay="auto"
          />
        </div>
        <div>
          <span>Weight:</span>
          <Slider
            value={filters.weight || 0}
            min={0}
            max={1000}
            onChange={(event, value) => handleFilterChange('weight', value as number)}
            valueLabelDisplay="auto"
          />
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Base Experience</TableCell>
              <TableCell>Height</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableRows()}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button key={page} onClick={() => handlePageChange(page)}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PokemonTable;
