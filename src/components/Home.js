import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/api";
import RecoverPassword from "./RecoverPassword";
import PomodoroItem from "./PomodoroItem";

const Home = ({ user }) => {
    const [recoveryToken, setRecoveryToken] = useState(null);
    const {
        register,
        handleSubmit,
        // formState: { errors },
    } = useForm();
    const [pomodoros, setPomodoros] = useState([]);
    const [errorText, setError] = useState("");

    useEffect(() => {
        /* Recovery url is of the form
         * <SITE_URL>#access_token=x&refresh_token=y&expires_in=z&token_type=bearer&type=recovery
         * Read more on https://supabase.com/docs/reference/javascript/reset-password-email#notes
         */
        let url = window.location.hash;
        let query = url.substr(1);
        let result = {};

        query.split("&").forEach((part) => {
            const item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });

        if (result.type === "recovery") {
            setRecoveryToken(result.access_token);
        }

        fetchPomodoros().catch(console.error);
    }, []);

    const fetchPomodoros = async () => {
        let { data: pomodoros, error } = await supabase
            .from("pomodoros")
            .select("*")
            .order("id", { ascending: false });
        if (error) console.log("error", error);
        else setPomodoros(pomodoros);
    };

    const deletePomodoro = async (id) => {
        try {
            await supabase.from("pomodoros").delete().eq("id", id);
            setPomodoros(pomodoros.filter((x) => x.id !== id));
        } catch (error) {
            console.log("error", error);
        }
    };

    const addPomodoro = async (inputs) => {
        if (!inputs.name) {
            setError("A pomodoro name must be set");
        } else {
            let { data: pomodoro, error } = await supabase
                .from("pomodoros")
                .insert({
                    name: inputs.name,
                    starting_at: inputs.startingAt,
                    focus: inputs.focus,
                    break: inputs.break,
                    long_break: inputs.long_break,
                    loop_before_long_break: inputs.loopsBeforeLongBreak,
                    ending_at: inputs.endingAt,
                    created_by: user.id,
                })
                .single();
            if (error) setError(error.message);
            else {
                setPomodoros([pomodoro, ...pomodoros]);
                setError(null);
            }
        }
    };

    const handleLogout = async () => {
        supabase.auth.signOut().catch(console.error);
    };

    return recoveryToken ? (
        <RecoverPassword
            token={recoveryToken}
            setRecoveryToken={setRecoveryToken}
        />
    ) : (
        <div className={"w-screen fixed flex flex-col min-h-screen bg-gray-50"}>
            <header
                className={
                    "flex justify-between items-center px-4 h-16 bg-gray-900"
                }
            >
                <span
                    className={
                        "text-2xl sm:text-4xl text-white border-b font-sans"
                    }
                >
                    Pomodoros.
                </span>
                <button
                    onClick={handleLogout}
                    className={
                        "flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                    }
                >
                    Logout
                </button>
            </header>
            <div
                className={"flex flex-col flex-grow p-4"}
                style={{ height: "calc(100vh - 11.5rem)" }}
            >
                <div
                    className={`p-2 border flex-grow grid gap-2 ${
                        pomodoros.length ? "auto-rows-min" : ""
                    } grid-cols-1 h-2/3 overflow-y-scroll first:mt-8`}
                >
                    {pomodoros.length ? (
                        pomodoros.map((pomodoro) => (
                            <PomodoroItem
                                user={user}
                                key={pomodoro.id}
                                pomodoro={pomodoro}
                                onDelete={() => deletePomodoro(pomodoro.id)}
                            />
                        ))
                    ) : (
                        <span
                            className={
                                "h-full flex justify-center items-center"
                            }
                        >
                            You do have any pomodoro yet!
                        </span>
                    )}
                </div>
                {!!errorText && (
                    <div
                        className={
                            "border max-w-sm self-center px-4 py-2 mt-4 text-center text-sm bg-red-100 border-red-300 text-red-400"
                        }
                    >
                        {errorText}
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit(addPomodoro)}>
                <div className={"flex m-4 mt-0 h-10"}>
                    <input
                        type="text"
                        className={
                            "bg-gray-200 border px-2 border-gray-300 w-full mr-4"
                        }
                        placeholder="Name"
                        {...register("name")}
                    />
                    <input
                        type="text"
                        className={
                            "bg-gray-200 border px-2 border-gray-300 w-full mr-4"
                        }
                        placeholder="Starting at"
                        defaultValue={"09:00+01"}
                        {...register("startingAt")}
                    />
                    <input
                        type="text"
                        className={
                            "bg-gray-200 border px-2 border-gray-300 w-full mr-4"
                        }
                        placeholder="Focus"
                        defaultValue={"25"}
                        {...register("focus")}
                    />
                    <input
                        type="text"
                        className={
                            "bg-gray-200 border px-2 border-gray-300 w-full mr-4"
                        }
                        placeholder="Break"
                        defaultValue={"5"}
                        {...register("break")}
                    />
                    <input
                        type="text"
                        className={
                            "bg-gray-200 border px-2 border-gray-300 w-full mr-4"
                        }
                        placeholder="Long break"
                        defaultValue={"15"}
                        {...register("longBreak")}
                    />
                    <input
                        type="text"
                        className={
                            "bg-gray-200 border px-2 border-gray-300 w-full mr-4"
                        }
                        placeholder="Loops"
                        defaultValue={"4"}
                        {...register("loopsBeforeLongBreak")}
                    />
                    <input
                        type="text"
                        className={
                            "bg-gray-200 border px-2 border-gray-300 w-full mr-4"
                        }
                        placeholder="Enging at"
                        defaultValue={"18:00+01"}
                        {...register("endingAt")}
                    />
                    <button
                        type="submit"
                        className={
                            "flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                        }
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Home;
