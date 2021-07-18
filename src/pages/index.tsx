import { nanoid } from "nanoid";
import Head from "next/head";
import Image from "next/image";
import { useState, memo } from "react";
import { useEffect } from "react";
import { FiPlusSquare, FiPlus } from "react-icons/fi";

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
  let [apiSearchOffset, setApiSearchOffset] = useState(0);
  const [pokemonArr, setPokemonArr] = useState([]);

  async function handleFetchMore() {
    setApiSearchOffset(apiSearchOffset + 10);

    const fetechedPokemons = await fetchPokemons(apiSearchOffset);
    const newPokemons = new Set([...pokemonArr, ...fetechedPokemons]);

    setPokemonArr(Array.from(newPokemons));
  }

  useEffect(() => {
    console.log(pokemons);
    setPokemonArr(pokemons);
  }, [pokemons]);

  return (
    <div>
      <div>
        <h1>Poke API</h1>
      </div>

      <p>pokemon count: {pokemonArr.length}</p>
      {pokemonArr.map((pokemon) => (
        <div key={nanoid()}>
          <Pokemon pokemon={pokemon} />
        </div>
      ))}

      <div>
        <button onClick={() => handleFetchMore()}>
          <FiPlus /> Load more...
        </button>
      </div>
    </div>
  );
}
