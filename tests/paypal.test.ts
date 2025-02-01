import { generateAccessToken } from "../src/lib/paypal";

// Generate a PayPal access toke
test("generates a PayPal access token", async () => {
  const tokenResonse = await generateAccessToken();
  console.log(tokenResonse);
  expect(typeof tokenResonse).toBe("string");
  expect(tokenResonse.length).toBeGreaterThan(0);
});
