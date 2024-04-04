import { WordCloud, Stat, Value } from "@/models/analysis";
import { Review, reviewConverter } from "@/models/review";

export function computeReviewsSummary(reviews: Review[]): {
  wordCloud: WordCloud[];
  stats: Stat[];
} {
  return {
    wordCloud: [
      getWordCloud(reviews, "vibe"),
      getWordCloud(reviews, "services"),
    ],
    stats: [
      getStat(reviews, "tourists", "Tourists"),
      getStat(reviews, "security", "Security"),
      getStat(reviews, "noise", "Noise"),
      getStat(reviews, "cleaning", "Cleaning"),
    ],
  };
}

function getWordCloud(reviews: Review[], group: string): WordCloud {
  const wordCount: { [word: string]: number } = {};

  reviews.forEach((review) => {
    const reviewMap = reviewConverter.toFirestore(review)["data"];

    const neighbourhood = review.data.neighbourhood;
    if (neighbourhood && reviewMap["neighbourhood"][group]) {
      const words = reviewMap["neighbourhood"][group] as string[];
      words.forEach((word) => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
    }
  });

  const words = Object.keys(wordCount).map((word) => ({
    word,
    count: wordCount[word],
  }));
  words.sort((a, b) => b.count - a.count);

  return { group, words };
}

function getStat(
  reviews: Review[],
  statKey: string,
  statDisplayText: string
): Stat {
  const statCount: { [key: string]: number } = {};
  let statTotal = 0;

  reviews.forEach((review) => {
    const reviewMap = reviewConverter.toFirestore(review)["data"];

    const neighbourhood = review.data.neighbourhood;
    if (neighbourhood && reviewMap["neighbourhood"][statKey]) {
      const value = reviewMap["neighbourhood"][statKey] as string;
      statCount[value] = (statCount[value] || 0) + 1;
      statTotal++;
    }
  });

  const values: Value[] = Object.keys(statCount).map((key) => ({
    key,
    value: statCount[key],
    percentage: parseFloat(((statCount[key] / statTotal) * 100).toFixed(2)),
  }));

  values.sort((a, b) => b.value - a.value);

  return { stat: statKey, total: statTotal, statDisplayText, values };
}
