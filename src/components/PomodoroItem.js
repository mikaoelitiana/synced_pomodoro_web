const PomodoroItem = ({ pomodoro, onDelete, user }) => {
    return (
        <div
            className={"p-3 max-h-14 flex align-center justify-between border"}
        >
            <span className={"truncate flex-grow"}>
                <span className={`w-full flex-grow font-bold	`}>
                    #{pomodoro.id} &nbsp;
                </span>
                <span className={`w-full flex-grow`}>{pomodoro.name}</span>
                <span className={`w-full flex-grow`}>
                    &nbsp;| Starts at <b>{pomodoro.starting_at}</b>
                </span>
                <span className={`w-full flex-grow`}>
                    &nbsp;| <b>{pomodoro.focus}min</b> focus
                </span>
                <span className={`w-full flex-grow`}>
                    &nbsp;| <b>{pomodoro.break}min</b> break
                </span>
                <span className={`w-full flex-grow`}>
                    &nbsp;| <b>{pomodoro.long_break}min</b> long break after{" "}
                    <b>{pomodoro.loop_before_long_break} loops</b>
                </span>
            </span>
            {user.id === pomodoro.created_by && (
                <button
                    className={"font-mono text-red-500 text-xl border px-2"}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    ❌
                </button>
            )}
        </div>
    );
};

export default PomodoroItem;
