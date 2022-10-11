import { Anchor } from "grommet";
import { Login, Play } from "grommet-icons";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useAuthContext } from "../context/auth";
import styles from "../styles/Home.module.scss";
import shwackCloudImage from "../public/ShwackCloud.png";

const Home: NextPage = () => {
  const { user } = useAuthContext();
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Image src={shwackCloudImage} />
        <div className={styles.icon}>
          <h1>
            Login or register to create or edit your account and SoundCloud URL
          </h1>
          <Link href="/play">
            <Anchor icon={<Login size="large" />} />
          </Link>
        </div>
        <div className={styles.icon} style={{}}>
          <h1>Skip and play existing playlists</h1>
          <Link href="/play">
            <Anchor icon={<Play size="large" />} />
          </Link>
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
