import { db } from "../db/index.js";
import { testResults } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

export const saveTestResult = async (req, res) => {
  const { wpm, rawWpm, accuracy, mode } = req.body;

  try {
    const [newResult] = await db
      .insert(testResults)
      .values({
        userId: req.userId,
        wpm,
        rawWpm,
        accuracy,
        durationMode: mode,
      })
      .returning();

    res.status(201).json(newResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving test result" });
  }
};

export const getTestHistory = async (req, res) => {
  try {
    const history = await db
      .select()
      .from(testResults)
      .where(eq(testResults.userId, req.userId))
      .orderBy(desc(testResults.timestamp))
      .limit(50); // Limit to last 50 tests

    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching test history" });
  }
};
