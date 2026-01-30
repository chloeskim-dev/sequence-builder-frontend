import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSequence } from "../../hooks/useSequence";
import {
  IoList,
  IoPause,
  IoPlay,
  IoPlaySkipBack,
  IoPlaySkipForward,
} from "react-icons/io5";
import { IoIosOptions } from "react-icons/io";
import { VscDebugRestart } from "react-icons/vsc";
import { formatSecondsToTimeString } from "../../utils/timeHelpers";
import { DurationsSequence } from "../../constants/types";

const SequenceRunPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    sequence,
    fetchSequence,
    removeExercisesWithoutDurationFromSequence,
    error,
    setError,
  } = useSequence(id);
  const [durationsOnlySequence, setDurationsOnlySequence] = useState<
    DurationsSequence | undefined
  >(undefined);
  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [isShowingExercisesList, setIsShowingExercisesList] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [showNextExercisePreview, setShowNextExercisePreview] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  // const [hasEnded, setHasEnded] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  const borderColorStyle = "border-black";
  const borderWidthStyle = "[0.5px]";
  const pageStyles =
    "flex-1 flex flex-col w-full h-full items-center justify-center";
  // const playerStyles = `flex flex-col w-[90%] h-[400px] sm:w-[80%] md:w-[70%] border-${borderWidthStyle} ${borderColorStyle} text-white bg-hmt-dark-option2`;
  const playerStyles = `flex flex-col w-[90%] h-full sm:w-[80%] md:w-[70%] border border-${borderWidthStyle} ${borderColorStyle}`;
  const playerControlStyles = `flex gap-x-2 items-center border-b border-${borderWidthStyle} ${borderColorStyle} pr-1 py-0.5`;
  const currentExerciseAndExercisesListContainerStyles =
    "flex flex-col flex-1 overflow-y-auto md:flex-row break-words";
  const currentExerciseContainerStyles = "min-w-0 flex-[3] overflow-y-auto";
  const exercisesListContainerStyles = isShowingExercisesList
    ? `md:flex-[1] md:h-full max-h-[200px] md:max-h-full md:border-l-${borderWidthStyle} ${borderColorStyle} min-w-0`
    : "hidden";
  const exercisesListStyles = `border-${borderWidthStyle} ${borderColorStyle} h-full flex flex-col bg-gray-200 px-2`;
  const exercisesListRowStyles = `flex flex-row my-0.5 border ${borderColorStyle} px-2 gap-x-2 justify-between text-xs py-1 text-left align-top w-full bg-white`;
  const currentExerciseNameStyles =
    // "flex-[1] text-[50px] text-center leading-[45px] mb-[30px] break-words";
    "text-[20px] text-center break-words my-3 mx-4 font-bold text-mt-red";
  const currentExerciseColumnsStyles = "grid grid-cols-2 gap-2";
  // const currentExerciseDetailsContainerStyles = `m-2 px-8 ${borderColorStyle} border-${borderWidthStyle}`;
  const currentExerciseDetailsContainerStyles = `m-2 px-8`;
  const currentExerciseKeyColumnStyles =
    "text-right text-sm text-mt-red font-semibold";
  const currentExerciseValueColumnStyles = "min-w-0 break-words text-sm";

  const buttonStyles = `bg-gray-300 text-black p-2`;
  const optionsBoxStyles = isShowingOptions ? "block" : "hidden";

  useEffect(() => {
    if (id) fetchSequence();
  }, []);

  useEffect(() => {
    if (sequence) {
      const durationsSequence =
        removeExercisesWithoutDurationFromSequence(sequence);
      setDurationsOnlySequence(durationsSequence);
    }
  }, [sequence]);

  useEffect(() => {
    if (durationsOnlySequence && currentIndex !== null)
      setTimeRemaining(
        durationsOnlySequence.exercises[currentIndex].duration_secs ?? 0,
      );
  }, [currentIndex]);

  useEffect(() => {
    const currentSequence = durationsOnlySequence;
    if (
      !isPlaying ||
      currentSequence === undefined ||
      currentIndex === null ||
      timeRemaining === null ||
      isSeeking
    )
      return;

    const currentIdx = currentIndex;

    const intervalId = setInterval(() => {
      setTimeRemaining((currentTimeRemaining) => {
        if (currentTimeRemaining === null) return null;

        if (currentTimeRemaining <= 1) {
          if (currentIdx < currentSequence.exercises.length - 1) {
            const nextIndex = currentIdx + 1;
            setCurrentIndex(nextIndex);
            return currentSequence.exercises[nextIndex].duration_secs ?? 0;
          } else {
            setIsPlaying(false);
            return 0;
          }
        }

        return currentTimeRemaining - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPlaying, currentIndex, sequence?.exercises, isSeeking]);

  if (!durationsOnlySequence) return <p>Loading...</p>;

  const toggleShowOptions = () => {
    setIsShowingOptions(!isShowingOptions);
  };

  const toggleShowExercisesList = () => {
    setIsShowingExercisesList(!isShowingExercisesList);
  };
  const toggleIsPlaying = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipClick = (indexOfExerciseWhenSkipWasClicked: number) => {
    const clickedSkipOnLastExercise =
      indexOfExerciseWhenSkipWasClicked ===
      durationsOnlySequence.exercises.length - 1;
    if (clickedSkipOnLastExercise || currentIndex === null) {
      // console.log("nah fam this is last exercose");
      return;
    } else {
      setCurrentIndex((currentIndex) => currentIndex! + 1);
    }
  };

  const handleBackClick = (indexOfExerciseWhenBackWasClicked: number) => {
    const clickedBackOnFirstExercise = indexOfExerciseWhenBackWasClicked === 0;
    if (clickedBackOnFirstExercise || currentIndex === null) return;
    else {
      setCurrentIndex((currentIndex) => currentIndex! - 1);
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    setCurrentIndex(0);
  };

  const indexOfLastExerciseInDurationsOnlySequence =
    durationsOnlySequence.exercises.length - 1;

  const handleRestartClick = () => {
    setCurrentIndex(0);
  };

  const handleExerciseClick = (index: number) => {
    setCurrentIndex(index);
  };

  const totalSequenceDurationSecs = durationsOnlySequence.exercises.reduce(
    (sum, ex) => sum + (ex.duration_secs ?? 0),
    0,
  );

  const currentExercise =
    currentIndex !== null
      ? durationsOnlySequence.exercises[currentIndex]
      : undefined;

  const elapsedSequenceSecs =
    currentIndex !== null
      ? // portion from earlier exercises
        durationsOnlySequence.exercises
          .slice(0, currentIndex)
          .reduce((sum, ex) => sum + (ex.duration_secs ?? 0), 0) +
        // portion from current exercise
        (currentExercise?.duration_secs != null && timeRemaining != null
          ? currentExercise.duration_secs - timeRemaining
          : 0)
      : undefined;

  if (!hasStarted)
    return (
      <div className={pageStyles}>
        <div className="text-gb-yellow mb-4 font-bold w-[90%] sm:w-[80%] md:w-[70%] text-center">
          Please note that all exercises without durations are removed from the
          sequence player.
        </div>
        <button
          onClick={handleStart}
          className="bg-mt-red rounded text-sm font-bold py-2 px-4 text-white"
        >
          Continue
        </button>
      </div>
    );

  return (
    <div className={pageStyles}>
      <div className={playerStyles}>
        <div className={playerControlStyles}>
          {currentIndex !== null && (
            // {/* <div>------PLAYER CONTROLS-----</div> */}
            <div>
              <div className="flex pl-1 items-center">
                <button
                  className="border-2 bg-gray-300 p-2"
                  onClick={() => handleBackClick(currentIndex)}
                >
                  <IoPlaySkipBack />
                </button>
                <button
                  className="border-2 bg-gray-300 p-2"
                  onClick={toggleIsPlaying}
                >
                  {isPlaying ? <IoPause /> : <IoPlay />}
                </button>
                <button
                  className="border-2 bg-gray-300 p-2"
                  onClick={() => handleSkipClick(currentIndex)}
                >
                  <IoPlaySkipForward />
                </button>
                {currentIndex === durationsOnlySequence.exercises.length - 1 &&
                  timeRemaining === 0 && (
                    <button
                      onClick={handleRestartClick}
                      className="border-2 bg-gray-300 p-2"
                    >
                      <VscDebugRestart color="black" fill="black" />
                    </button>
                  )}
              </div>
            </div>
          )}

          {currentIndex !== null && (
            <div className="flex-1 flex gap-x-2 items-center">
              <div>
                {formatSecondsToTimeString(
                  durationsOnlySequence.exercises[currentIndex]!
                    .duration_secs! - timeRemaining!,
                )}
              </div>

              <input
                type="range"
                min={0}
                max={
                  durationsOnlySequence.exercises[currentIndex].duration_secs ??
                  0
                }
                value={
                  (durationsOnlySequence.exercises[currentIndex]
                    .duration_secs ?? 0) - (timeRemaining ?? 0)
                }
                onChange={(e) => {
                  const duration =
                    durationsOnlySequence.exercises[currentIndex]
                      .duration_secs ?? 0;
                  const elapsed = Number(e.target.value);
                  const remaining = Math.max(0, duration - elapsed);
                  setTimeRemaining(remaining);
                }}
                onMouseDown={() => setIsSeeking(true)}
                onMouseUp={() => setIsSeeking(false)}
                onTouchStart={() => setIsSeeking(true)}
                onTouchEnd={() => setIsSeeking(false)}
                className=" w-full accent-mt-red"
              />
              <div>
                {formatSecondsToTimeString(
                  durationsOnlySequence.exercises[currentIndex]!.duration_secs!,
                )}
              </div>
            </div>
          )}

          {/* toggle buttons */}
          <div className="flex flex-row gap-1">
            {/* toggle options */}
            <button className={buttonStyles} onClick={toggleShowOptions}>
              <IoIosOptions />
            </button>
            {/* toggle exercises list */}
            <button className={buttonStyles} onClick={toggleShowExercisesList}>
              <IoList />
            </button>
          </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {currentIndex !== null && (
          <div className={currentExerciseAndExercisesListContainerStyles}>
            <div className={currentExerciseContainerStyles}>
              {/* <div>Time Remaining: {timeRemaining}</div> */}
              <div>
                <div className={currentExerciseNameStyles}>
                  {durationsOnlySequence.exercises[currentIndex].name}
                </div>
              </div>
              {/* current exercise details */}
              <div className={currentExerciseDetailsContainerStyles}>
                <div className={currentExerciseColumnsStyles}>
                  <div className={currentExerciseKeyColumnStyles}>
                    Resistance
                  </div>
                  <div className={currentExerciseValueColumnStyles}>
                    {durationsOnlySequence.exercises[currentIndex].resistance ??
                      "-"}
                  </div>
                </div>
                <div className={currentExerciseColumnsStyles}>
                  <div className={currentExerciseKeyColumnStyles}>
                    Direction
                  </div>

                  <div className={currentExerciseValueColumnStyles}>
                    {durationsOnlySequence.exercises[currentIndex].direction ??
                      "-"}
                  </div>
                </div>
                <div className={currentExerciseColumnsStyles}>
                  <div className={currentExerciseKeyColumnStyles}>Notes</div>

                  <div className={currentExerciseValueColumnStyles}>
                    {durationsOnlySequence.exercises[currentIndex].notes ?? "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className={exercisesListContainerStyles}>
              {/* <div>------SEQUENCE EXERCISES-----</div> */}
              <div className={exercisesListStyles}>
                <div className="text-sm font-bold text-center mt-1">
                  Class Exercises
                </div>
                <div className="flex-1 overflow-y-auto">
                  {durationsOnlySequence.exercises.map((exercise, index) => (
                    <button
                      key={index}
                      className={
                        currentIndex === index
                          ? `${exercisesListRowStyles} bg-red-100`
                          : exercisesListRowStyles
                      }
                      onDoubleClick={() => handleExerciseClick(index)}
                    >
                      <div
                        className={`${
                          currentIndex === index
                            ? "font-bold truncate"
                            : "truncate"
                        }`}
                      >
                        {exercise.name}
                      </div>
                      <div
                        className={`${
                          currentIndex === index ? "font-bold" : ""
                        }`}
                      >
                        {formatSecondsToTimeString(
                          exercise.duration_secs ?? 0,
                        ) ?? "-"}
                      </div>
                    </button>
                  ))}
                </div>
                {elapsedSequenceSecs !== undefined && (
                  <div className="sticky bottom-0 py-2 text-gray-800 text-sm text-xs text-center">
                    Elapsed: {formatSecondsToTimeString(elapsedSequenceSecs)} /{" "}
                    {formatSecondsToTimeString(totalSequenceDurationSecs)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* {showNextExercisePreview &&
                    currentIndex !== null &&
                    currentIndex <
                        durationsOnlySequence.exercises.length - 1 && (
                        <div className="">
                            <div>------NEXT EXERCISE PREVIEW-----</div>
                            <div className="flex-1 flex flex-col">
                                <div className="flex flex-row">
                                    <div className="flex-1">Name</div>
                                    <div className="flex-1">
                                        {
                                            durationsOnlySequence.exercises[
                                                currentIndex + 1
                                            ].name
                                        }
                                    </div>
                                </div>

                                <div className="flex flex-row">
                                    <div className="flex-1">Resistance</div>
                                    <div className="flex-1">
                                        {durationsOnlySequence.exercises[
                                            currentIndex + 1
                                        ].resistance ?? "-"}
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex-1">Direction</div>

                                    <div className="flex-1">
                                        {durationsOnlySequence.exercises[
                                            currentIndex + 1
                                        ].direction ?? "-"}
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex-1">Notes</div>

                                    <div className="flex-1">
                                        {durationsOnlySequence.exercises[
                                            currentIndex + 1
                                        ].notes ?? "-"}
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex-1">Duration Secs</div>

                                    <div className="flex-1">
                                        {durationsOnlySequence.exercises[
                                            currentIndex + 1
                                        ].duration_secs ?? "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} */}
      </div>

      {/* <div className={optionsBoxStyles}>
                <div>------OPTIONS BOX-----</div>

                <label>
                    <input
                        type="checkbox"
                        checked={showNextExercisePreview}
                        onChange={() =>
                            setShowNextExercisePreview(!showNextExercisePreview)
                        }
                        className="mr-1"
                    />
                    Show next exercise preview
                </label>
            </div> */}
    </div>
  );
};

export default SequenceRunPage;
