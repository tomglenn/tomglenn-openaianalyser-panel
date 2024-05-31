type AnalysisType = 'insights' | 'accessibility' | 'diagnosis';

export interface SimpleOptions {
  apiKey: string;
  analysisType: AnalysisType;
}
