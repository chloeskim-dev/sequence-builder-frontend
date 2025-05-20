import React from "react";
import Searchbar from "../../components/ui/Searchbar";

type Props = {
  exerciseQuery: string;
  setExerciseQuery: React.Dispatch<React.SetStateAction<string>>;
};

const ExercisesSearchbar = ({ exerciseQuery, setExerciseQuery }: Props) => {
  return (
    <div>
      <h1>ExercisesSearchbar Component</h1>
      <Searchbar
        placeholder="Enter an exercise name..."
        query={exerciseQuery}
        setQuery={setExerciseQuery}
      />
    </div>
  )
};

export default ExercisesSearchbar;