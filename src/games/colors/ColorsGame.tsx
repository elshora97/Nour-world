import { ColorObject } from '../../components/ColorCard/ColorObject';
import { QuizChoice } from '../../components/Quiz/QuizChoice';
import { QuizScreen } from '../../components/Quiz/QuizScreen';
import { colorPraise, colorPrompt, colors } from '../../data/colors';
import { useQuizGame } from '../../hooks/useQuizGame';

interface ColorsGameProps {
  onHome: () => void;
}

export function ColorsGame({ onHome }: ColorsGameProps) {
  const game = useQuizGame({ pool: colors, prompt: colorPrompt, praise: colorPraise });

  return (
    <QuizScreen
      game={game}
      label="الألوان"
      onHome={onHome}
      renderPrompt={(target) => (
        <>
          فين اللون{' '}
          <span style={{ color: target.hex, WebkitTextStroke: `0.25vh ${target.edge}` }}>
            {target.nameWithArticle}
          </span>
          {`؟ ${target.emoji}`}
        </>
      )}
      renderChoice={(color, props) => (
        <QuizChoice label={color.name} {...props}>
          <ColorObject shape={color.shape} fill={color.hex} edge={color.edge} />
        </QuizChoice>
      )}
    />
  );
}
