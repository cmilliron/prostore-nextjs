import { generateAccessToken, paypal } from "../src/lib/paypal";

// Generate a PayPal access token
test("generates a PayPal access token", async () => {
  const tokenResonse = await generateAccessToken();
  console.log(tokenResonse);
  expect(typeof tokenResonse).toBe("string");
  expect(tokenResonse.length).toBeGreaterThan(0);
});

// Create a PayPal Order
test("creats a PayPal order", async () => {
  //   const token = await generateAccessToken();
  const price = 10.0;

  const orderResponse = await paypal.createOrder(price);
  console.log(orderResponse);

  // Ensur the order responscontsin expected fields
  expect(orderResponse).toHaveProperty("id");
  expect(orderResponse).toHaveProperty("status");
  expect(orderResponse.status).toBe("CREATED");
});

// Capture payment with Mock Order
test("simulate capturee a PayPal order", async () => {
  const orderid = "100"; // Mock Order

  // Mock the capturePayment function to return asuccessful response
  const mockCapturePayment = jest
    .spyOn(paypal, "capturePayment")
    .mockResolvedValue({
      status: "COMPLETED",
    });

  // Call teh cpaturePayment fucntion wiht the mock order ID
  const captureResponse = await paypal.capturePayment(orderid);
  // Ensure the capture response contains expected fields
  expect(captureResponse).toHaveProperty("status", "COMPLETED");

  // Clean up mock
  mockCapturePayment.mockRestore();
});
