export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type ChallengeDifficulty = "Easy" | "Medium" | "Hard";

export interface DataStructure {
  slug: string;
  name: string;
  category: "Linear" | "Non-Linear" | "Hash-Based";
  difficulty: Difficulty;
  description: string;
  shortDescription: string;
  operations: string[];
  timeComplexity: {
    access: string;
    search: string;
    insert: string;
    delete: string;
  };
  advantages: string[];
  disadvantages: string[];
  useCases: string[];
}

export interface Algorithm {
  slug: string;
  name: string;
  category: "Searching" | "Sorting" | "Graph" | "Other";
  difficulty: Difficulty;
  description: string;
  shortDescription: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  useCases: string[];
  steps: AlgorithmStep[];
}

export interface AlgorithmStep {
  description: string;
  explanation: string;
  whyDidItDoThat?: string;
  codeLine?: number;
}

export interface Challenge {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: ChallengeDifficulty;
  category: string;
}
