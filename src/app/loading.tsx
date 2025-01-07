import Image from "next/image";
import loader from "@/assets/loader.gif";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Image src={loader} width={150} height={150} alt='"Loading gif' />
    </div>
  );
}
