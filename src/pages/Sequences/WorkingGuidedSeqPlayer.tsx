import { useState, useEffect } from "react";
import { Sequence } from "../../constants/types";
import SequencePlayerExerciseStation from "./SequencePlayerExerciseStation";
import CheckboxOptionsContainer from "../../components/ui/CheckboxOptionsContainer";
import { getValidDurationSecs } from "../../utils/returnValidValues";

interface GuidedSequencePlayerProps {
  sequence: Sequence;
}

export default function GuidedSequencePlayer({
  sequence,
}: GuidedSequencePlayerProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // on the curent exercise
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [displayNotes, setDisplayNotes] = useState(false);
  const [displayResistance, setDisplayResistance] = useState(false);
  const [displayDirection, setDisplayDirection] = useState(false);
  const [showMapView, setShowMapView] = useState(true);
  const [showNextExercisePreview, setShowNextExercisePreview] = useState(true);

  const currentExercise = sequence.exercises[currentIndex];
  const nextExercise =
    currentIndex < sequence.exercises.length - 1
      ? sequence.exercises[currentIndex + 1]
      : null;

  const nextExerciseLabelStyles =
    "text-xs font-bold md:text-sm md:font-semibold md:pl-4 text-gray-600 italic";
  const nextExerciseTextStyles = "text-xs text-gray-600 italic";
  const currentExerciseLabelStyles =
    "text-xs font-bold md:text-sm md:font-semibold md:pl-4";
  const currentExerciseTextStyles = "text-sm";
  const flexGridStyles =
    "flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-y-1";
  const sectionTitleStyles = "font-bold text-md";
  const optionsContainerStyles = "bg-gray-100 p-3";
  const optionsStyles = "flex flex-col md:flex-row md:gap-x-6";

  const optionsFieldStyles = "flex items-center gap-1 text-sm";
  const optionTextStyles = "text-xs";

  const sequenceMapOptions = [
    {
      label: "display direction",
      checked: displayDirection,
      onChange: setDisplayDirection,
    },
    {
      label: "display resistance",
      checked: displayResistance,
      onChange: setDisplayResistance,
    },
    {
      label: "display notes",
      checked: displayNotes,
      onChange: setDisplayNotes,
    },
  ];
  const sequencePlayerOptions = [
    {
      label: "show map view",
      checked: showMapView,
      onChange: setShowMapView,
    },
    {
      label: "show next exercise preview",
      checked: showNextExercisePreview,
      onChange: setShowNextExercisePreview,
    },
  ];

  useEffect(() => {
    if (currentExercise) {
      const durationSecs = getValidDurationSecs(currentExercise);
      setTimeRemaining(durationSecs);
    }
  }, [currentExercise]);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setTimeRemaining((currentIndexTimeRemaining) => {
        if (currentIndexTimeRemaining <= 1) {
          if (currentIndex < sequence.exercises.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            return getValidDurationSecs(currentExercise);
          } else {
            setIsRunning(false);
            return 0;
          }
        }
        return currentIndexTimeRemaining - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, currentIndex, sequence.exercises]);

  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);
  const handleNext = () => {
    if (currentIndex < sequence.exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsRunning(false);
    }
  };
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsRunning(false);
    setTimeRemaining(sequence.exercises[0]?.duration_secs || 0);
  };

  const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="p-4 border rounded max-w-4xl mx-auto">
      <div className="flex flex-col">
        <div className={sectionTitleStyles}>Sequence Runner</div>
        <div className="my-2">
          <CheckboxOptionsContainer
            options={sequencePlayerOptions}
            title="Sequence Runner Options"
            containerClassName={optionsContainerStyles}
            optionsClassName={optionsStyles}
            labelClassName={optionsFieldStyles}
            textClassName={optionTextStyles}
          />
        </div>

        {currentExercise ? (
          <div>
            <div className="flex flex-wrap gap-2 my-4">
              {isRunning ? (
                <button
                  onClick={handlePause}
                  className="font-bold text-sm px-4 py-2 bg-yellow-500 text-white"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={handleResume}
                  className="font-bold text-sm px-4 py-2 bg-green-600 text-white"
                >
                  Resume
                </button>
              )}
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="font-bold text-sm px-4 py-2 bg-gray-400 text-white disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === sequence.exercises.length - 1}
                className="font-bold text-sm px-4 py-2 bg-blue-600 text-white disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={handleRestart}
                className="font-bold text-sm px-4 py-2 bg-red-600 text-white"
              >
                Restart
              </button>
            </div>
            <div className={sectionTitleStyles}>Current Exercise </div>

            <div className="pl-4">
              <div
                className={`font-semibold uppercase text-red-600 font-extrabold py-1`}
              >
                {`${formatTime(timeRemaining)} remaining`}
              </div>
              <div className="font-semibold pb-2 uppercase">
                {currentExercise.name}
              </div>

              <div className={flexGridStyles}>
                {currentExercise.direction && (
                  <>
                    <div className={currentExerciseLabelStyles}>Direction</div>
                    <div className={currentExerciseTextStyles}>
                      {currentExercise.direction}
                    </div>
                  </>
                )}
                {currentExercise.resistance && (
                  <>
                    <div className={currentExerciseLabelStyles}>Resistance</div>
                    <div className={currentExerciseTextStyles}>
                      {currentExercise.resistance}
                    </div>
                  </>
                )}
                {currentExercise.notes && (
                  <>
                    <div className={currentExerciseLabelStyles}>Notes</div>
                    <div className={currentExerciseTextStyles}>
                      {currentExercise.notes}
                    </div>
                  </>
                )}
                {currentExercise.duration_secs && (
                  <>
                    <div className={currentExerciseLabelStyles}>Duration</div>
                    <div className={currentExerciseTextStyles}>
                      {formatTime(currentExercise.duration_secs)}
                    </div>
                  </>
                )}
              </div>
            </div>
            {nextExercise && showNextExercisePreview && (
              <div className="my-2 p-3 bg-gray-50 border-l-4 border-blue-300">
                <div className="text-sm font-semibold pb-2 italic text-gray-600">
                  Up next:{" "}
                  <span className="uppercase">{nextExercise.name}</span>
                </div>
                <div className={`${flexGridStyles} pl-2`}>
                  <div className={nextExerciseLabelStyles}>Direction</div>
                  <div className={nextExerciseTextStyles}>
                    {typeof nextExercise.direction === "string" &&
                      `${nextExercise.direction}s`}
                  </div>
                  <div className={nextExerciseLabelStyles}>Resistance</div>
                  <div className={nextExerciseTextStyles}>
                    {typeof nextExercise.resistance === "string" &&
                      `${nextExercise.resistance}`}
                  </div>
                  <div className={nextExerciseLabelStyles}>Notes</div>
                  <div className={nextExerciseTextStyles}>
                    {typeof nextExercise.notes === "string" &&
                      `${nextExercise.notes}`}
                  </div>
                  <div className={nextExerciseLabelStyles}>Duration</div>
                  <div className={nextExerciseTextStyles}>
                    {typeof nextExercise.duration_secs === "number" &&
                      formatTime(nextExercise.duration_secs)}
                  </div>
                </div>
              </div>
            )}

            {showMapView && (
              <div className="bg-gray-50 p-4">
                <div className={sectionTitleStyles}>Map View</div>
                <div className="my-2">
                  <CheckboxOptionsContainer
                    options={sequenceMapOptions}
                    title="Map View Options"
                    containerClassName={optionsContainerStyles}
                    optionsClassName={optionsStyles}
                    labelClassName={optionsFieldStyles}
                    textClassName={optionTextStyles}
                  />
                </div>
                <div>
                  {sequence.exercises.map((exercise, index, arr) => {
                    const isPast = index < currentIndex;
                    const isFirst = index === 0;
                    const isLast = index === arr.length - 1;

                    return (
                      <SequencePlayerExerciseStation
                        key={exercise.id}
                        exercise={exercise}
                        index={index}
                        isPast={isPast}
                        isFirst={isFirst}
                        isLast={isLast}
                        displayNotes={displayNotes}
                        displayDirection={displayDirection}
                        displayResistance={displayResistance}
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        timeRemaining={timeRemaining}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>No exercises found.</p>
        )}
      </div>
    </div>
  );
}
