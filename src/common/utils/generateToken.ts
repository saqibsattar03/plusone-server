export async function generateToken(): Promise<string> {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyz*-+/+!@#$%^&*}{)(|~ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}
