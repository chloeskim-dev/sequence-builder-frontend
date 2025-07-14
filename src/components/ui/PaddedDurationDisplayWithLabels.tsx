import React from "react";

interface Props {
    minutes: number;
    seconds: number;
}
const labelStyles = "block font-medium text-sm mb-1";
const textStyles = "text-sm";

const PaddedDurationDisplayWithLabels = ({ minutes, seconds }: Props) => {
    return (
        <div>
            <span className={`${labelStyles} mb-0`}>Duration</span>
            <div className="flex items-end gap-x-1">
                <div>
                    <label
                        htmlFor="durationMinutes"
                        className={"text-gray-500 text-[10px]"}
                    >
                        Min
                    </label>

                    <div id="durationMin" className={"text-sm"}>
                        {minutes}{" "}
                    </div>
                </div>
                <div className="text-sm">:</div>
                <div className="ml-1">
                    <label
                        htmlFor="durationSeconds"
                        className={"text-gray-500 text-[10px]"}
                    >
                        Sec
                    </label>

                    <div id="durationSeconds" className={"text-sm"}>
                        {String(seconds).padStart(2, "0")}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaddedDurationDisplayWithLabels;
