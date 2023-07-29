"use client";

import "tailwindcss/tailwind.css";
import {v4 as uuidv4} from "uuid";
import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {
  addLetter,
  enter,
  reset,
  getNewAnwser,
  deleteCharacter,
} from "../GlobalRedux/Features/wordleReducer";
import {RootState} from "../GlobalRedux/store";
import Firework from "./components/Firework";

const buttonStyle =
  "w-11 h-10 text-orange-600 hover:text-orange-300 cursor-pointer focus:outline-none";

export default function Wordle() {
  const wordle = useSelector((state: RootState) => state.wordle);
  const dispatch = useDispatch();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key.match(/^[a-zA-Z]$/)) {
      const key = event.key.toUpperCase() as string;
      dispatch(addLetter(key));
    } else if (event.key === "Enter") {
      dispatch(enter());
    } else if (event.key === "Backspace") {
      dispatch(deleteCharacter());
    }
  };

  useEffect(() => {
    dispatch(getNewAnwser());
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-16">
      <div className="text-yellow-600 font-bold text-5xl">Wordle</div>

      <div className="grid grid-cols-5 grid-flow-row gap-4 mt-5">
        {[...Array(6)].map((_, idx) => {
          return wordle.contentsObj[idx].map((contentObj) => {
            return (
              <div
                key={uuidv4()}
                className={
                  "w-20 h-20 flex justify-center items-center text-2xl " +
                  `${contentObj.style}`
                }>
                {contentObj.word}
              </div>
            );
          });
        })}
      </div>

      <div className="flex space-x-40">
        <div className={buttonStyle} onClick={() => dispatch(enter())}>
          ENTER
        </div>
        <div
          className={buttonStyle}
          onClick={() => dispatch(deleteCharacter())}>
          DELETE
        </div>
        <div className={buttonStyle} onClick={() => dispatch(reset())}>
          RESET
        </div>
      </div>
      <div>{wordle.winTheGame && "You Win!"}</div>
      <div>{wordle.showAnswer && `Answer: ${wordle.answer.join("")}`}</div>
      {wordle.winTheGame && (
        <div className="fixed bottom-0 h-1/3 -z-10">
          <Firework />
        </div>
      )}
    </div>
  );
}
