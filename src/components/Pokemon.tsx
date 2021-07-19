import { useState, useEffect, memo } from "react";
import Image from "next/image";
import { nanoid } from "nanoid";
import { FiCircle } from "react-icons/fi";

import styled from "styled-components";

export interface IPokeStats {
  stat: string;
  value: number;
}

export interface IPokemon {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
}

interface IPokemonProps {
  pokemon: IPokemon;
}

interface IAbility {
  ability: { name: string; url: string };
  is_hidden: boolean;
  slot: number;
}

interface IType {
  slot: number;
  type: { name: string; url: string };
}

interface IPokemonDetail {
  abilities: IAbility[];
  base_experience: number;
  forms: any[];
  game_indices: any[];
  height: number;
  held_items: any[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: any[];
  name: string;
  order: number;
  past_types: any[];
  species: { name: string; url: string };
  sprites: any;
  stats: {
    base_stat: number;
    effort: number;
    stat: { name: string; url: string };
  }[];
  types: IType[];
  weight: number;
}

const Container = styled.div`
  border: 1px solid;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 210px;

  .info {
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    padding: 0 1rem;
    border: 1px solid;
  }

  ul,
  p,
  div.type {
    padding: 0;
    margin: 0;
    list-style: none;
    font-size: 12px;
  }

  ul h4,
  div.type h4 {
    padding: 0;
    margin: 0;
  }
`;
const Pokemon = ({ pokemon }: IPokemonProps) => {
  const [details, setDetails] = useState<IPokemonDetail>(null);

  useEffect(() => {
    async function getDetails() {
      const req = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
      );

      const fetchedDetails: IPokemonDetail = await req.json();

      return fetchedDetails;
    }
    const newDetails = getDetails();

    newDetails.then((data) => {
      setDetails(data);
    });
  }, [pokemon.id]);

  return (
    <Container>
      <h2>
        {pokemon.id} {pokemon.name}
      </h2>
      <Image src={pokemon.imageUrl} alt={pokemon.name} width={64} height={64} />
      {details && (
        <>
          <div className="info">
            <div>
              <p>Height </p>
              {details.height}
            </div>
            <div>
              <p>Weight </p>
              {details.weight}
            </div>
            <div>
              <p>Base XP</p> {details.base_experience}
            </div>
          </div>
          <ul>
            <div className="type">
              <h4>
                <FiCircle fill="#73ad58" />
                Type
              </h4>
              {details.types.map((item, i) => (
                <span key={nanoid()}>{item.type.name}&nbsp;</span>
              ))}
            </div>
            <h4>
              <FiCircle fill="#faf" />
              Stats
            </h4>
            {details.stats.map((item, i) => (
              <li key={nanoid()}>
                <span>
                  {item.stat.name}: {item.base_stat}
                </span>
              </li>
            ))}
          </ul>

          <ul>
            <h4>
              <FiCircle fill="dodgerblue" />
              Abilities
            </h4>
            {details.abilities.map((item, i) => (
              <li key={nanoid()}>
                <span>{item.ability.name}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {!details && <div>...Loading</div>}
    </Container>
  );
};

export default memo(Pokemon);
