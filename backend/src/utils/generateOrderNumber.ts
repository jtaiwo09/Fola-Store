// utils/generateOrderNumber.ts
import Counter from "@/models/Counter";
import dayjs from "dayjs";

export const generateOrderNumber = async (): Promise<string> => {
  const today = dayjs().format("YYYYMMDD"); // e.g. 20251003
  const counterId = `order-${today}`;

  const counter = await Counter.findByIdAndUpdate(
    counterId,
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // create if not exist
  );

  const paddedSeq = String(counter.seq).padStart(4, "0"); // e.g. 0001
  return `ORD-${today}-${paddedSeq}`;
};
