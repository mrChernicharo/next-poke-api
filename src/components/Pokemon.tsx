import { nanoid } from "nanoid";
import Image from "next/image";
import { useState, useEffect, memo } from "react";

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
    <div style={{ border: "1px solid black" }}>
      <h2>{pokemon.name}</h2>
      <Image src={pokemon.imageUrl} alt={pokemon.name} width={64} height={64} />
      {details && (
        <>
          <ul>
            <h4>Stats</h4>
            {details.stats.map((item, i) => (
              <li key={nanoid()}>
                <span>
                  {item.stat.name}: {item.base_stat}
                </span>
                <span></span>
              </li>
            ))}
          </ul>
          <div>
            <h4>Type</h4>
            {details.types.map((item, i) => (
              <span key={nanoid()}>{item.type.name}</span>
            ))}
          </div>
          <p>Height: {details.height}</p>
          <p>Weight: {details.weight}</p>
          <p>Base XP: {details.base_experience}</p>

          <ul>
            <h4>Abilities</h4>
            {details.abilities.map((item, i) => (
              <li key={nanoid()}>
                <span>{item.ability.name}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {!details && <div>...Loading</div>}
    </div>
  );
};
// export { Pokemon };
export default memo(Pokemon);
