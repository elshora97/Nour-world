import { Bubble, BubbleEmoji, BubbleLetter } from '../../components/Bubble/Bubble';
import { QuizChoice } from '../../components/Quiz/QuizChoice';
import { QuizScreen } from '../../components/Quiz/QuizScreen';
import { alphabet, letterPraise, letterPrompt, matchPraise, matchPrompt } from '../../data/alphabet';
import { useQuizGame } from '../../hooks/useQuizGame';

interface LetterQuizProps {
  onHome: () => void;
}

/** "فين حرف باء؟" — pick the letter out of three. */
export function FindLetter({ onHome }: LetterQuizProps) {
  const game = useQuizGame({ pool: alphabet, prompt: letterPrompt, praise: letterPraise });

  return (
    <QuizScreen
      game={game}
      label="الحروف"
      onHome={onHome}
      renderPrompt={(target) => `فين حرف ${target.name}؟ 👂`}
      renderChoice={(letter, props) => (
        <QuizChoice label={`حرف ${letter.name}`} {...props}>
          <Bubble tint={letter.tint} edge={letter.edge} label={props.state === 'winner' ? letter.name : null}>
            <BubbleLetter letter={letter.letter} color={letter.color} edge={letter.edge} />
          </Bubble>
        </QuizChoice>
      )}
    />
  );
}

/** "مين بيبدأ بحرف ب؟" — pick the picture that starts with the letter. */
export function MatchLetter({ onHome }: LetterQuizProps) {
  const game = useQuizGame({ pool: alphabet, prompt: matchPrompt, praise: matchPraise });

  return (
    <QuizScreen
      game={game}
      label="صور وحروف"
      onHome={onHome}
      renderPrompt={(target) => (
        <>
          مين بيبدأ بحرف
          <span
            className="mx-[1vh] text-[9vh] leading-none"
            style={{ color: target.color, textShadow: `0 0.5vh 0 ${target.edge}` }}
          >
            {target.letter}
          </span>
          ؟
        </>
      )}
      renderChoice={(letter, props) => (
        <QuizChoice label={letter.exampleWord} {...props}>
          <Bubble
            tint={letter.tint}
            edge={letter.edge}
            label={props.state === 'winner' ? letter.exampleWord : null}
          >
            <BubbleEmoji>{letter.emoji}</BubbleEmoji>
          </Bubble>
        </QuizChoice>
      )}
    />
  );
}
