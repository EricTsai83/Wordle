"use client";

import {createSlice} from "@reduxjs/toolkit";
import words from "../../words";

type Style = {
  [key: string]: string;
};

const style: Style = {
  default: "bg-white border-2 border-zinc-300",
  tempAns: "bg-white text-black border-2 border-zinc-400",
  correctSpot: "bg-lime-600 text-white",
  wrongSpot: "bg-amber-500 text-white",
  wrongWord: "bg-slate-600 text-white",
};

type ContentObj = {
  word: string | undefined;
  style: string;
};

type ContentObjs = {
  [key: string]: ContentObj[];
};

type InitialState = {
  contentsObj: ContentObjs;
  currentRow: string;
  currentCol: number;
  winTheGame: boolean;
  answer: string[];
  showAnswer: boolean;
};

const contentObj: ContentObj = {
  word: "",
  style: style.default,
};

const contentsObj = {
  0: Array(5).fill(contentObj),
  1: Array(5).fill(contentObj),
  2: Array(5).fill(contentObj),
  3: Array(5).fill(contentObj),
  4: Array(5).fill(contentObj),
  5: Array(5).fill(contentObj),
};

const getRandomWord = () => {
  return words[Math.floor(Math.random() * words.length)]
    .toUpperCase()
    .split("");
};

const initialState: InitialState = {
  contentsObj: contentsObj,
  currentRow: "0",
  currentCol: -1,
  winTheGame: false,
  answer: getRandomWord(),
  showAnswer: false,
};

export const wordleSlice = createSlice({
  name: "wordle",
  initialState,
  reducers: {
    addLetter: (state, action) => {
      if (state.currentCol === 4) {
        // pass
      } else {
        state.contentsObj[state.currentRow][state.currentCol + 1] = {
          word: action.payload,
          style: style.tempAns,
        };
        state["currentCol"] = state.currentCol + 1;
        state["contentsObj"] = state.contentsObj;
      }
    },
    enter: (state) => {
      if (state.currentCol === 4) {
        let score: number = 0;
        state.contentsObj[state.currentRow] = state.contentsObj[
          state.currentRow
        ].map((obj: ContentObj, idx: number) => {
          if (obj.word === state.answer[idx]) {
            score += 1;
            return {word: obj.word, style: style.correctSpot};
          } else if (obj.word && state.answer.includes(obj.word)) {
            return {word: obj.word, style: style.wrongSpot};
          } else {
            return {word: obj.word, style: style.wrongWord};
          }
        });

        state["showAnswer"] = score === 5 || state.currentRow === "5";
        state["currentCol"] =
          score === 5 || state.currentRow === "5" ? state.currentCol : -1;
        state["winTheGame"] = score === 5;
        state["currentRow"] =
          score === 5 || state.currentRow === "5"
            ? state.currentRow
            : String(Number(state.currentRow) + 1);
      }
    },
    reset: () => {
      return initialState;
    },
    getNewAnwser: (state) => {
      state["answer"] = getRandomWord();
    },

    deleteCharacter: (state) => {
      if (
        (state.currentCol === 4 && state.currentRow === "5") ||
        state.winTheGame === true
      ) {
        // pass
      } else {
        state.contentsObj[state.currentRow][state.currentCol] = {
          word: "",
          style: style.default,
        };
        state["currentCol"] =
          state.currentCol - 1 >= -1 ? state.currentCol - 1 : -1;
      }
    },
  },
});

export const {addLetter, enter, reset, getNewAnwser, deleteCharacter} =
  wordleSlice.actions;

export default wordleSlice.reducer;
