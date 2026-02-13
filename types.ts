
export enum Difficulty {
  BEGINNER = 'Beginner',
  PROFESSIONAL = 'Professional',
  MASTER = 'Master'
}

export interface SubnetQuestion {
  ip: string;
  cidr: number;
  mask: string;
  subnetId: string;
  firstHost: string;
  lastHost: string;
  broadcast: string;
  wildcard: string;
  classType: string;
}

export interface UserAnswers {
  mask: string;
  subnetId: string;
  firstHost: string;
  lastHost: string;
  broadcast: string;
  cidr: string;
}

export interface QuizResult {
  question: SubnetQuestion;
  userAnswers: UserAnswers;
  isCorrect: {
    mask: boolean;
    subnetId: boolean;
    firstHost: boolean;
    lastHost: boolean;
    broadcast: boolean;
    cidr: boolean;
  };
}

export interface SummaryQuestion {
  networks: string[];
  options: string[];
  correctAnswer: string;
  explanation: string;
}
