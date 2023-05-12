import { randomBytes } from 'crypto';
export async function getRandomNumber(
  min: number,
  max: number,
): Promise<number> {
  const range = max - min + 1;
  const bytes = Math.ceil(Math.log2(range) / 8);
  const randomNumber = parseInt(randomBytes(bytes).toString('hex'), 16);
  return min + (randomNumber % range);
}
