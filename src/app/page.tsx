import styles from './page.module.scss';
export default function Home() {
  return (
    <div
      className={styles.homePage}
      style={{
        border: '1px solid white',
      }}
    >
      Gokuljs
    </div>
  );
}
