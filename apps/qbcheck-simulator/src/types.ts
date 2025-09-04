export interface TimelineEvent {
  type: 'shape' | 'response';
  timestamp: number;
  data: {
    // For shape events
    shape?: {
      type: 'circle' | 'square';
      color: 'blue' | 'red';
      id: string;
    };
    displayDuration?: number;
    shouldMatch?: boolean;
    wasMissed?: boolean; // Indicates if this shape that should match was missed
    // For response events
    responseTime?: number;
    correct?: boolean;
    reactionTime?: number;
  };
}

export interface AssessmentResults {
  accuracy: number;
  correctResponses: number;
  incorrectResponses: number;
  missedResponses: number;
  averageReactionTime: number;
  reactionTimes: number[];
  movementScore: number;
  totalShapes: number;
  duration: number;
  timeline: TimelineEvent[];
}
