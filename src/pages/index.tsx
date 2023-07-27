import {v4 as uuidv4} from 'uuid';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';
import {useEffect, useReducer} from 'react';
import structuredClone from '@ungap/structured-clone';

type Style = {
  [key: string]: string;
};

const style: Style = {
  default: 'bg-white border-2 border-zinc-300',
  tempAns: 'bg-white text-black border-2 border-zinc-400',
  correctSpot: 'bg-lime-600 text-white',
  wrongSpot: 'bg-amber-500 text-white',
  wrongWord: 'bg-slate-600 text-white',
};
type ContentObj = {
  [key: string]: string;
};

type ContentsObj = {
  [key: string]: Array<ContentObj>;
};

type InitState = {
  contentsObj: ContentsObj;
  currentRow: string;
  currentCol: number;
  winTheGame: boolean;
};

const contentObj: ContentObj = {
  word: '',
  style: style.default,
};

const initState: InitState = {
  contentsObj: {
    0: Array(5).fill(contentObj),
    1: Array(5).fill(contentObj),
    2: Array(5).fill(contentObj),
    3: Array(5).fill(contentObj),
    4: Array(5).fill(contentObj),
    5: Array(5).fill(contentObj),
  },
  currentRow: '0',
  currentCol: -1,
  winTheGame: false,
};

// I need a clone object to use on reset action
const restState = structuredClone(initState);

type Action = {
  type: string;
  payload: string;
};

const reducer = (state: InitState, action: Action): InitState => {
  switch (action.type) {
    case 'addLetter':
      if (state.currentCol === 4) {
        return {...state};
      } else {
        state.contentsObj[state.currentRow][state.currentCol + 1] = {
          word: action.payload,
          style: style.tempAns,
        };
        return {
          ...state,
          currentCol: state.currentCol + 1,
          contentsObj: state.contentsObj,
        };
      }

    case 'delete':
      if (
        (state.currentCol === 4 && state.currentRow === '5') ||
        state.winTheGame === true
      ) {
        return {...state};
      } else {
        state.contentsObj[state.currentRow][state.currentCol] = {
          word: '',
          style: style.default,
        };
        return {
          ...state,
          currentCol: state.currentCol - 1 >= -1 ? state.currentCol - 1 : -1,
        };
      }

    case 'enter':
      const anwser = ['A', 'B', 'C', 'D', 'E'];
      if (
        // 位置在最後
        state.currentCol === 4
      ) {
        let score: number = 0;
        state.contentsObj[state.currentRow] = state.contentsObj[
          state.currentRow
        ].map((obj: any, idx: number) => {
          if (obj.word === anwser[idx]) {
            score += 1;
            return {word: obj.word, style: style.correctSpot};
          } else if (anwser.includes(obj.word)) {
            return {word: obj.word, style: style.wrongSpot};
          } else {
            return {word: obj.word, style: style.wrongWord};
          }
        });
        return {
          ...state,
          currentRow:
            score === 5 || state.currentRow === '5'
              ? state.currentRow
              : String(Number(state.currentRow) + 1),
          currentCol:
            score === 5 || state.currentRow === '5' ? state.currentCol : -1,
          winTheGame: score === 5,
        };
      } else {
        // don't do anything
        return {...state};
      }

    case 'reset':
      return structuredClone(restState);

    default:
      return structuredClone(restState);
  }
};

const buttonClassNames =
  'w-11 h-10 text-orange-600 hover:text-orange-300 cursor-pointer';

export default function Wordle() {
  const [state, dispatch] = useReducer(reducer, initState);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key.match(/^[a-zA-Z]$/)) {
      const key = event.key.toUpperCase();
      dispatch({type: 'addLetter', payload: key});
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="text-yellow-600 font-bold text-5xl">Wordle</div>

      <div>
        <Link href="/">
          <button>Back to home</button>
        </Link>
      </div>

      <div className="grid grid-cols-5 grid-flow-row gap-4">
        {[...Array(6)].map((_, idx) => {
          return state.contentsObj[idx].map((contentObj: ContentObj) => {
            return (
              <div
                key={uuidv4()}
                className={
                  'w-20 h-20 flex justify-center items-center text-2xl ' +
                  `${contentObj.style}`
                }>
                {contentObj.word}
              </div>
            );
          });
        })}
      </div>

      <div className="flex space-x-40">
        <div
          className={buttonClassNames}
          onClick={() => dispatch({type: 'enter', payload: ''})}>
          ENTER
        </div>
        <div
          className={buttonClassNames}
          onClick={() => dispatch({type: 'delete', payload: ''})}>
          DELETE
        </div>
        <div
          className={buttonClassNames}
          onClick={() => dispatch({type: 'reset', payload: ''})}>
          RESET
        </div>
      </div>
      <div>{state.winTheGame ? 'Game Status: Win' : 'Game Status: fail'}</div>
    </div>
  );
}
