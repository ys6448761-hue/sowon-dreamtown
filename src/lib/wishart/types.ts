export type ExpressionType = "sad" | "neutral" | "gentle_smile" | "bright_smile";

export interface PhotoProfile {
  description: string;
  person_count: number;
  expression: ExpressionType;
  age_impression: string;
  distinctive_features: string;
}
