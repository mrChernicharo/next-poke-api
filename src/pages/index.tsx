import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { FiPlus } from "react-icons/fi";

import styled from "styled-components";

import Pokemon, { IPokemon } from "../components/Pokemon";

interface IPokemonResponseData {
  count: 1118;
  nextPageUrl: string;
  previousPageUrl: string;
  results: IPokemon[];
}

interface IPokemonResponseItem {
  name: string;
  url: string;
}

interface Props {
  pokemons: IPokemon[];
  offset: number;
}

const Container = styled.div`
  div.pokemons-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    div.poke-card {
      margin-bottom: 2rem;
    }
  }

  div.btn {
    /* border: 1px solid; */
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;

    button {
      display: flex;
      align-items: center;
      background: red;
      color: white;
      border: none;
      border-radius: 1rem;
      font-size: 26px;
      padding: 1.5rem;
    }
  }
`;

function setPokemonData(data: IPokemonResponseItem[], offset = 0): IPokemon[] {
  return data.map((pokemon, i) => {
    const id = 1 + offset + i;
    const newPokemon: IPokemon = {
      id,
      name: pokemon.name,
      url: pokemon.url,
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`,
    };
    return newPokemon;
  });
}

async function fetchPokemons(offset = 0, limit = 10) {
  const baseURL = "https://pokeapi.co/api/v2/pokemon";

  const req = await fetch(`${baseURL}?offset=${offset}&limit=${limit}`);
  const response: IPokemonResponseData = await req.json();

  const pokemons = setPokemonData(response.results, offset);

  return pokemons;
}

export async function getStaticProps() {
  const pokemons = await fetchPokemons();

  return {
    props: {
      pokemons,
    },
  };
}

export default function Home({ pokemons }: Props) {
  let [apiSearchOffset, setApiSearchOffset] = useState(10);
  const [pokemonArr, setPokemonArr] = useState([]);

  async function handleFetchMore() {
    const fetechedPokemons = await fetchPokemons(apiSearchOffset);
    const newPokemons = new Set([...pokemonArr, ...fetechedPokemons]);

    setApiSearchOffset(apiSearchOffset + 10);
    setPokemonArr(Array.from(newPokemons));
  }

  useEffect(() => {
    console.log(pokemons);
    setPokemonArr(pokemons);

    return () => {};
  }, [pokemons]);

  return (
    <Container>
      <div>
        <h1>Poke API</h1>
      </div>

      <p>pokemon count: {pokemonArr.length}</p>

      <div className="pokemons-container">
        {pokemonArr.map((pokemon) => (
          <div className="poke-card" key={nanoid()}>
            <Pokemon pokemon={pokemon} />
          </div>
        ))}
      </div>

      <div className="btn">
        <button onClick={() => handleFetchMore()}>
          <FiPlus /> Load more...
        </button>
      </div>
    </Container>
  );
}
