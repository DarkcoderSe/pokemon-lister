import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Slider, Container, Card, Typography, Box, Link } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { Pokemon, Filters } from '../interfaces';
import { getPokemons } from '../services/pokemon';

const PokemonTable: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sorting, setSorting] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({});
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await getPokemons({
          page,
          per_page: perPage,
          sort_by: sorting,
          name: searchTerm,
          ...filters,
        });
    
        setPokemons(response.items);
        setTotalPages(response.total_pages);
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
    // If the same property is clicked again, reverse the sorting order
    setSorting((prevSorting) => (prevSorting === property ? `-${property}` : property));

    // Sort the pokemons array based on the selected property
    const sortedPokemons = [...pokemons].sort((a, b) => {
      const sortOrder = sorting === property ? 1 : -1;
      if (property === 'name') {
        return a.name.localeCompare(b.name) * sortOrder; // Sort by name (alphabetically)
      } else if (property === 'base_experience') {
        return (a.base_experience - b.base_experience) * sortOrder; // Sort by base_experience (numerically)
      } else if (property === 'height') {
        return (a.height - b.height) * sortOrder; // Sort by height (numerically)
      } else if (property === 'weight') {
        return (a.weight - b.weight) * sortOrder; // Sort by weight (numerically)
      }
      return 0;
    });

    setPokemons(sortedPokemons);
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
    <Container>
      <div>
        <Card sx={{ mt: 4 }} variant="outlined">
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ m: 2 }}>
              
              <TextField
                label="Search by name"
                value={searchTerm}
                onChange={handleSearchChange}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <Link href="#" onClick={() => setFilters({})}>
                Clear Filters
              </Link>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ m: 2 }}>
              <Typography variant="body1">Base Experience:</Typography>
              <Slider
                value={filters.base_experience || 0}
                min={0}
                max={500}
                onChange={(event, value) => handleFilterChange('base_experience', value as number)}
                valueLabelDisplay="auto"
              />
            </Box>
            <Box sx={{ m: 2 }}>
              <Typography variant="body1">Height:</Typography>
              <Slider
                value={filters.height || 0}
                min={0}
                max={300}
                onChange={(event, value) => handleFilterChange('height', value as number)}
                valueLabelDisplay="auto"
              />
            </Box>
            <Box sx={{ m: 2 }}>
              <Typography variant="body1">Weight:</Typography>
              <Slider
                value={filters.weight || 0}
                min={0}
                max={1000}
                onChange={(event, value) => handleFilterChange('weight', value as number)}
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>
        </Card>
      
        <TableContainer sx={{ mt: 4 }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSortChange('name')}>Name</TableCell>
                <TableCell onClick={() => handleSortChange('base_experience')}>Base Experience</TableCell>
                <TableCell onClick={() => handleSortChange('height')}>Height</TableCell>
                <TableCell onClick={() => handleSortChange('weight')}>Weight</TableCell>
                <TableCell>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        </TableContainer>

        <div>
          <Pagination
            sx={{ mt: 4 }}
            count={totalPages}
            page={page}
            onChange={(event, value) => handlePageChange(value)}
            variant="outlined"
            shape="rounded"
          />
        </div>
      </div>
    </Container>
    
  );
};

export default PokemonTable;
