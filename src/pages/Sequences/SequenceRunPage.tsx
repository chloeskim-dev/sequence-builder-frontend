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

export const SequenceRunPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { sequence, initializeDurationsSequence } = useSequence(id);
    const [isShowingOptions, setIsShowingOptions] = useState(false);
    const [isShowingExercisesList, setIsShowingExercisesList] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [showNextExercisePreview, setShowNextExercisePreview] =
        useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [hasStarted, setHasStarted] = useState(false);
    // const [hasEnded, setHasEnded] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);

    const playerStyles =
        "w-[90%] sm:w-[80%] md:w-[70%] border-4 border-white text-white";
    const playerContainerStyles =
        "flex-1 flex flex-col w-full h-full items-center justify-center";
    const currentExerciseContainerStyles =
        "min-w-0 flex-[3] flex flex-col px-6 py-8";
    const exercisesListStyles = isShowingExercisesList
        ? "flex-1 md:border-l-2 min-w-0 p-1"
        : "hidden";
    const exercisesListRowStyles =
        "flex flex-row border-b px-2 gap-x-2 justify-between text-xs py-0.5 text-left align-top w-full";
    const currentExerciseNameStyles =
        "flex-[1] text-[50px] text-center leading-[45px] mb-[30px] break-words";
    const currentExerciseColumnsStyles = "flex flex-row gap-x-2";
    const currentExerciseKeyColumnStyles = "flex-1 text-right";
    const currentExerciseValueColumnStyles = "flex-1";

    const buttonStyles = "border bg-blue-500 text-white p-1";
    const optionsBoxStyles = isShowingOptions ? "block" : "hidden";

    useEffect(() => {
        if (id) {
            initializeDurationsSequence();
        }
    }, [id, initializeDurationsSequence]);

    // return <GuidedSequencePlayer sequence={sequence} />;

    useEffect(() => {
        if (sequence && currentIndex !== null)
            setTimeRemaining(
                sequence.exercises[currentIndex].duration_secs ?? 0
            );
    }, [currentIndex]);

    useEffect(() => {
        if (
            !isPlaying ||
            sequence === null ||
            currentIndex === null ||
            timeRemaining === null ||
            isSeeking
        )
            return;

        const currentSequence = sequence;
        const currentIdx = currentIndex;

        const intervalId = setInterval(() => {
            setTimeRemaining((currentTimeRemaining) => {
                if (currentTimeRemaining === null) return null;

                if (currentTimeRemaining <= 1) {
                    if (currentIdx < currentSequence.exercises.length - 1) {
                        const nextIndex = currentIdx + 1;
                        setCurrentIndex(nextIndex);
                        return (
                            currentSequence.exercises[nextIndex]
                                .duration_secs ?? 0
                        );
                    } else {
                        setIsPlaying(false);
                        // setHasEnded(true);
                        return 0;
                    }
                }

                return currentTimeRemaining - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isPlaying, currentIndex, sequence?.exercises, isSeeking]);

    if (!sequence) return <p>Loading...</p>;

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
            indexOfExerciseWhenSkipWasClicked === sequence.exercises.length - 1;
        if (clickedSkipOnLastExercise || currentIndex === null) {
            // console.log("nah fam this is last exercose");
            return;
        } else {
            setCurrentIndex((currentIndex) => currentIndex! + 1);
        }
    };

    const handleBackClick = (indexOfExerciseWhenSkipWasClicked: number) => {
        const clickedBackOnFirstExercise =
            indexOfExerciseWhenSkipWasClicked === 0;
        if (clickedBackOnFirstExercise || currentIndex === null) return;
        else {
            setCurrentIndex((currentIndex) => currentIndex! - 1);
        }
    };

    const handleStart = () => {
        setHasStarted(true);
        setCurrentIndex(0);
    };

    const handleRestartClick = () => {
        // setCurrentIndex(0);
        // setHasEnded(false);
        // setHasStarted(false);
        setCurrentIndex(0);
    };

    const handleExerciseClick = (index: number) => {
        setCurrentIndex(index);
    };

    const totalSequenceDurationSecs = sequence.exercises.reduce(
        (sum, ex) => sum + (ex.duration_secs ?? 0),
        0
    );

    const currentExercise =
        currentIndex !== null ? sequence.exercises[currentIndex] : undefined;

    const elapsedSequenceSecs =
        currentIndex !== null
            ? sequence.exercises
                  .slice(0, currentIndex)
                  .reduce((sum, ex) => sum + (ex.duration_secs ?? 0), 0) +
              (currentExercise?.duration_secs != null && timeRemaining != null
                  ? currentExercise.duration_secs - timeRemaining
                  : 0)
            : undefined;

    if (!hasStarted)
        return (
            <div className={playerContainerStyles}>
                <div className="text-gb-yellow mb-4 font-bold w-[90%] sm:w-[80%] md:w-[70%] text-center">
                    Please note that all exercises without durations are removed
                    from the sequence player.
                </div>
                <button
                    onClick={handleStart}
                    className="bg-mt-red rounded text-sm font-bold py-2 px-4 text-white"
                >
                    Start
                </button>
            </div>
        );

    return (
        <div className={playerContainerStyles}>
            <div className={playerStyles}>
                <div className=" flex gap-x-2 items-center border-b-2 border-white">
                    {currentIndex !== null && (
                        // {/* <div>------PLAYER CONTROLS-----</div> */}
                        <div>
                            <div className="flex gap-x-4 pl-2 items-center">
                                <button
                                    onClick={() =>
                                        handleBackClick(currentIndex)
                                    }
                                >
                                    <IoPlaySkipBack />
                                </button>
                                <button onClick={toggleIsPlaying}>
                                    {isPlaying ? <IoPause /> : <IoPlay />}
                                </button>
                                <button
                                    onClick={() =>
                                        handleSkipClick(currentIndex)
                                    }
                                >
                                    <IoPlaySkipForward />
                                </button>
                                <button onClick={handleRestartClick}>
                                    {currentIndex ===
                                        sequence.exercises.length - 1 &&
                                        timeRemaining === 0 && (
                                            <VscDebugRestart />
                                        )}
                                </button>
                            </div>
                        </div>
                    )}

                    {currentIndex !== null && (
                        <div className="flex-1 flex gap-x-2 items-center">
                            <div>
                                {formatSecondsToTimeString(
                                    sequence!.exercises[currentIndex]!
                                        .duration_secs! - timeRemaining!
                                )}
                            </div>

                            <input
                                type="range"
                                min={0}
                                max={
                                    sequence.exercises[currentIndex]
                                        .duration_secs ?? 0
                                }
                                value={
                                    (sequence.exercises[currentIndex]
                                        .duration_secs ?? 0) -
                                    (timeRemaining ?? 0)
                                }
                                onChange={(e) => {
                                    const duration =
                                        sequence.exercises[currentIndex]
                                            .duration_secs ?? 0;
                                    const elapsed = Number(e.target.value);
                                    const remaining = Math.max(
                                        0,
                                        duration - elapsed
                                    );
                                    setTimeRemaining(remaining);
                                }}
                                onMouseDown={() => setIsSeeking(true)}
                                onMouseUp={() => setIsSeeking(false)}
                                onTouchStart={() => setIsSeeking(true)}
                                onTouchEnd={() => setIsSeeking(false)}
                                className="w-full"
                            />
                            <div>
                                {formatSecondsToTimeString(
                                    sequence!.exercises[currentIndex]!
                                        .duration_secs!
                                )}
                            </div>
                        </div>
                    )}

                    {/* toggle buttons */}
                    <div className="flex flex-row">
                        {/* toggle options */}
                        <button
                            className={buttonStyles}
                            onClick={toggleShowOptions}
                        >
                            <IoIosOptions />
                        </button>
                        {/* toggle exercises list */}
                        <button
                            className={buttonStyles}
                            onClick={toggleShowExercisesList}
                        >
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
                    <div className=" flex flex-col md:flex-row md:items-stretch">
                        <div className={currentExerciseContainerStyles}>
                            {/* <div>Time Remaining: {timeRemaining}</div> */}
                            <div className={currentExerciseColumnsStyles}>
                                {/* <div className={currentExerciseKeyColumnStyles}>
                                    Name
                                </div> */}
                                <div className={currentExerciseNameStyles}>
                                    {sequence.exercises[currentIndex].name}
                                </div>
                            </div>

                            <div className={currentExerciseColumnsStyles}>
                                <div className={currentExerciseKeyColumnStyles}>
                                    Resistance
                                </div>
                                <div
                                    className={currentExerciseValueColumnStyles}
                                >
                                    {sequence.exercises[currentIndex]
                                        .resistance ?? "-"}
                                </div>
                            </div>
                            <div className={currentExerciseColumnsStyles}>
                                <div className={currentExerciseKeyColumnStyles}>
                                    Direction
                                </div>

                                <div
                                    className={currentExerciseValueColumnStyles}
                                >
                                    {sequence.exercises[currentIndex]
                                        .direction ?? "-"}
                                </div>
                            </div>
                            <div className={currentExerciseColumnsStyles}>
                                <div className={currentExerciseKeyColumnStyles}>
                                    Notes
                                </div>

                                <div
                                    className={currentExerciseValueColumnStyles}
                                >
                                    {sequence.exercises[currentIndex].notes ??
                                        "-"}
                                </div>
                            </div>
                            {/* <div className={currentExerciseColumnsStyles}>
                                <div className={currentExerciseKeyColumnStyles}>
                                    Duration Secs
                                </div>

                                <div
                                    className={currentExerciseValueColumnStyles}
                                >
                                    {sequence.exercises[currentIndex]
                                        .duration_secs ?? "-"}
                                </div>
                            </div> */}
                        </div>

                        <div className={exercisesListStyles}>
                            {/* <div>------SEQUENCE EXERCISES-----</div> */}
                            {/* <div className="flex flex-row w-[400px]">
                            <div className="flex-1">NAME</div>
                            <div className="flex-1">DURATION_SECS</div>
                        </div> */}
                            <div className="border-2 h-full flex flex-col justify-between">
                                <div>
                                    {sequence.exercises.map(
                                        (exercise, index) => (
                                            <button
                                                key={index}
                                                className={
                                                    exercisesListRowStyles
                                                }
                                                onDoubleClick={() =>
                                                    handleExerciseClick(index)
                                                }
                                            >
                                                <div
                                                    className={`${
                                                        currentIndex === index
                                                            ? "font-bold text-gb-yellow"
                                                            : ""
                                                    }`}
                                                >
                                                    {exercise.name}
                                                </div>
                                                <div
                                                    className={`${
                                                        currentIndex === index
                                                            ? "font-bold"
                                                            : ""
                                                    }`}
                                                >
                                                    {formatSecondsToTimeString(
                                                        exercise.duration_secs ??
                                                            0
                                                    ) ?? "-"}
                                                </div>
                                            </button>
                                        )
                                    )}
                                </div>
                                {elapsedSequenceSecs !== undefined && (
                                    <div className="sticky bottom-0 py-0.5 text-gray-500 text-sm text-xs text-center">
                                        Elapsed:{" "}
                                        {formatSecondsToTimeString(
                                            elapsedSequenceSecs
                                        )}{" "}
                                        /{" "}
                                        {formatSecondsToTimeString(
                                            totalSequenceDurationSecs
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {showNextExercisePreview &&
                    currentIndex !== null &&
                    currentIndex < sequence.exercises.length - 1 && (
                        <div className="">
                            <div>------NEXT EXERCISE PREVIEW-----</div>
                            <div className="flex-1 flex flex-col">
                                <div className="flex flex-row">
                                    <div className="flex-1">Name</div>
                                    <div className="flex-1">
                                        {
                                            sequence.exercises[currentIndex + 1]
                                                .name
                                        }
                                    </div>
                                </div>

                                <div className="flex flex-row">
                                    <div className="flex-1">Resistance</div>
                                    <div className="flex-1">
                                        {sequence.exercises[currentIndex + 1]
                                            .resistance ?? "-"}
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex-1">Direction</div>

                                    <div className="flex-1">
                                        {sequence.exercises[currentIndex + 1]
                                            .direction ?? "-"}
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex-1">Notes</div>

                                    <div className="flex-1">
                                        {sequence.exercises[currentIndex + 1]
                                            .notes ?? "-"}
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex-1">Duration Secs</div>

                                    <div className="flex-1">
                                        {sequence.exercises[currentIndex + 1]
                                            .duration_secs ?? "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>

            <div className={optionsBoxStyles}>
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
            </div>
        </div>
    );
};
