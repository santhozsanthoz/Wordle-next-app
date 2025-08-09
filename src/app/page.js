import Image from "next/image";
import styles from "./page.module.css";
import Main from "./main";

export default function Home() {
  return (
    <div >
      <h1>Wordle</h1>
      <Main />
    </div>
  );
}
