import { AnimalCard, animalWinAnimations } from '../../components/AnimalCard/AnimalCard';
import { QuizChoice } from '../../components/Quiz/QuizChoice';
import { QuizScreen } from '../../components/Quiz/QuizScreen';
import { animalPraise, animalPrompt, animals } from '../../data/animals';
import { useQuizGame } from '../../hooks/useQuizGame';

interface AnimalsGameProps {
  onHome: () => void;
}

export function AnimalsGame({ onHome }: AnimalsGameProps) {
  const game = useQuizGame({ pool: animals, prompt: animalPrompt, praise: animalPraise });

  return (
    <QuizScreen
      game={game}
      label="الحيوانات"
      onHome={onHome}
      renderPrompt={(target) => `فين ${target.nameWithArticle}؟ 👀`}
      renderChoice={(animal, props) => (
        <QuizChoice label={animal.name} winAnimation={animalWinAnimations[animal.motion]} {...props}>
          <AnimalCard animal={animal} showName={props.state === 'winner'} />
        </QuizChoice>
      )}
    />
  );
}
