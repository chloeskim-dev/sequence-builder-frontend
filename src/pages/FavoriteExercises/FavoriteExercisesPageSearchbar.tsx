import React from "react";
import Searchbar from "../../components/ui/Searchbar";

type Props = {
  favoriteExerciseQuery: string;
  setFavoriteExerciseQuery: React.Dispatch<React.SetStateAction<string>>;
};

const FavoriteExercisesSearchbar = ({
  favoriteExerciseQuery,
  setFavoriteExerciseQuery,
}: Props) => {
  return (
    <div>
      <Searchbar
        placeholder="Search by name"
        query={favoriteExerciseQuery}
        setQuery={setFavoriteExerciseQuery}
      />
    </div>
  );
};

export default FavoriteExercisesSearchbar;
