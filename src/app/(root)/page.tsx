const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function Homepage() {
  await delay(2000);
  return <h1>HomePage</h1>;
}
