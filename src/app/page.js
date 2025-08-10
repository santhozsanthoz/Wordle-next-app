import Image from "next/image";
import styles from "./page.module.css";
import Main from "./main";

export default function Home() {
  return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
      <div style={{color: "black", margin: "20px", marginBottom: "30px"}}><h1>Diana's Wordle</h1></div>
      <div><Main /></div>
    </div>
  );
}
