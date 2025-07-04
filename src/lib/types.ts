type QuestionBase = {
  question: string;
  hint?: string;
  explanation: string;
  answer: string;
  userAnswer?: string; 
};

export type MultipleChoiceQuestion = QuestionBase & {
  type: "multiple_choice";
  options: Record<string, string>;
};

export type ShortAnswerQuestion = QuestionBase & {
  type: "short_answer";
};

export type CodingQuestion = QuestionBase & {
  type: "coding";
  expected_output: string; // exact stdout or return value for a test case
};

export type Question =
  | MultipleChoiceQuestion
  | ShortAnswerQuestion
  | CodingQuestion;

export type FormState = {
  message: string;
  data: string;
  error: boolean;
};

export type ExerciseSet = {
  id: string;
  title: string;
  createdAt: string;
  exercises: Question[];
  isFinished?: boolean;

};
