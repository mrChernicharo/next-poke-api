import Image from "next/image";
import { useEffect } from "react";

export interface IPokeStats {
  stat: string;
  value: number;
}

export interface IPokemon {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  //   height: number;
  //   stats: IPokeStats[];
}

interface IPokemonProps {
  pokemon: IPokemon;
}

export const Pokemon: React.FC<IPokemonProps> = ({
  pokemon,
}: IPokemonProps) => {
  useEffect(() => console.log(pokemon));
  return (
    <div style={{ border: "1px solid black" }}>
      <h2>{pokemon.name}</h2>
      <Image src={pokemon.imageUrl} alt={pokemon.name} width={24} height={24} />
    </div>
  );
};
