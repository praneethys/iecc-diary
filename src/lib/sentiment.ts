import { pipeline, type TextClassificationOutput } from "@huggingface/transformers";

export const getSentiment = async (
  answer: string,
): Promise<TextClassificationOutput | TextClassificationOutput[]> => {
  const sentimentPipeline = await pipeline(
    "sentiment-analysis",
    "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
    { dtype: "fp32" },
  );

  return await sentimentPipeline(answer);
};
