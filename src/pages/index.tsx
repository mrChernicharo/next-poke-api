import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";

import { Pokemon, IPokemon } from "../components/Pokemon";

interface PokemonResponseData {
  count: 1118;
  nextPageUrl: string;
  previousPageUrl: string;
  results: IPokemon[];
}

interface PokemonResponseItem {
  name: string;
  url: string;
}

interface Props {
  pokemons: IPokemon[];
  limit: number;
  offset: number;
}

export async function getStaticProps() {
  const baseURL = "https://pokeapi.co/api/v2";
  const queryParam = "/pokemon";
  const offset = 120;
  const limit = 10;

  const req = await fetch(
    `${baseURL + queryParam}?offset=${offset}&limit=${limit}`
  );
  const pokemonResponseData = await req.json();
  console.log(pokemonResponseData);

  function setPokemonData(): IPokemon[] {
    return pokemonResponseData.results.map((pokemon, i) => {
      const id = offset + i + 1;
      const newPokemon: IPokemon = {
        id,
        name: pokemon.name,
        url: pokemon.url,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`,
      };
      return newPokemon;
    });
  }

  return {
    props: { pokemons: setPokemonData(), limit, offset, baseURL },
  };
}

export default function Home({ pokemons, limit, offset }: Props) {
  const [pokemonArr, setPokemonArr] = useState([]);

  useEffect(() => {
    console.log(pokemons);
    setPokemonArr(pokemons);
  }, [pokemons]);

  return (
    <div>
      <h1>Poke API</h1>

      {pokemonArr.map((pokemon) => (
        <div key={pokemon.name}>
          <Pokemon pokemon={pokemon} />
        </div>
      ))}
    </div>
  );
}
