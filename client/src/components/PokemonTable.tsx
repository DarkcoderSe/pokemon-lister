import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Slider, Container, Card } from '@mui/material';
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
    <Container>
      <div>
        <Card variant="outlined">
          <div>
            <TextField
              label="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              margin="normal"
              
            />
            <Button variant="contained" color="primary" onClick={() => setFilters({})} >
              Clear Filters
            </Button>
          </div>
        </Card>
      <div >
        
        <div >
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
          <Pagination
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
