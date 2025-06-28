import React, { SetStateAction } from "react";
import { Exercise } from "../../constants/types";

type SequencePlayerExerciseStationProps = {
  index: number;
  isPast: boolean;
  exercise: Exercise;
  isFirst: boolean;
  isLast: boolean;
  displayNotes: boolean;
  displayDirection: boolean;
  displayResistance: boolean;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<SetStateAction<number>>;
  timeRemaining: number;
};
export default function SequencePlayerExerciseStation({
  index,
  isPast,
  exercise,
  isFirst,
  isLast,
  displayNotes,
  displayDirection,
  displayResistance,
  currentIndex,
  setCurrentIndex,
  timeRemaining,
}: SequencePlayerExerciseStationProps) {
  const changeCurrentExercise = (index: number) => {
    setCurrentIndex(index);
  };
  const isCurrent = index === currentIndex;

  const extraContentStyles = `text-xs mt-1  ${
    isCurrent
      ? "text-blue-600 font-bold"
      : isPast
      ? "text-gray-400"
      : "text-gray-500"
  }`;
  return (
    <div>
      <div className="flex items-stretch">
        <div className="flex flex-col items-center  transform translate-y-[8px]">
          <div
            onClick={() => changeCurrentExercise(index)}
            className={`relative w-4 h-4 z-10  shrink-0 ${
              isCurrent ? "bg-blue-600" : isPast ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            {isCurrent && <div className="absolute inset-[4px] bg-green-200" />}
          </div>

          <div
            className={`w-1 flex-1 ${
              isLast ? "invisible" : isPast ? "bg-gray-400" : "bg-blue-600"
            }`}
          />
        </div>

        <div
          onClick={() => changeCurrentExercise(index)}
          className={`h-1 w-6 self-start mt-[14px] ${
            isCurrent ? "bg-blue-600" : isPast ? "bg-gray-400" : "bg-blue-600"
          }`}
        />

        <div className="ml-1 mb-4 flex-1 flex flex-col md:flex-row md:gap-x-2 items-start">
          <div className="flex flex-col">
            <div
              className={`
            whitespace-nowrap
            text-sm py-1 px-2
            ${
              isCurrent
                ? "text-blue-600 bg-green-200 font-bold"
                : isPast
                ? "text-gray-400"
                : "text-gray-500"
            }
          `}
            >
              {exercise.name}
            </div>

            <div className="flex-1">
              {isCurrent && (
                <div className="text-sm text-red-600 font-bold whitespace-nowrap">
                  {Math.floor(timeRemaining / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(timeRemaining % 60).toString().padStart(2, "0")} remaining
                </div>
              )}
            </div>
          </div>

          <div className="pl-2 md:pl-0 md:transform md:translate-y-[2px] ">
            {exercise.direction && displayDirection && (
              <div className={extraContentStyles}>{exercise.direction}</div>
            )}
            {exercise.resistance && displayResistance && (
              <div className={extraContentStyles}>{exercise.resistance}</div>
            )}

            {exercise.notes && displayNotes && (
              <div className={extraContentStyles}>{exercise.notes}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
