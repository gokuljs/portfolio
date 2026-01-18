import styles from '@styles/Footer.module.scss';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.Footer}>
      <div className={styles.footerContent}>
        <div className={styles.logoSection}>
          <Link href="/" className={styles.footerLogo}>
            Gokul JS
          </Link>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.linkColumn}>
            <h4 className={styles.columnHeading}>Connect</h4>
            <Link
              href="https://github.com/gokuljs"
              target="_blank"
              className={styles.footerLink}
            >
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/in/gokul-js/"
              target="_blank"
              className={styles.footerLink}
            >
              LinkedIn
            </Link>
            <Link
              href="https://twitter.com/gokul_js029"
              target="_blank"
              className={styles.footerLink}
            >
              Twitter
            </Link>
            <Link
              href="https://substack.com/@gokuljs"
              target="_blank"
              className={styles.footerLink}
            >
              Substack
            </Link>
          </div>

          <div className={styles.linkColumn}>
            <h4 className={styles.columnHeading}>Contact</h4>
            <Link
              href="mailto:jsgokul123@gmail.com"
              className={styles.footerLink}
            >
              Email
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        © {currentYear} Gokul JS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
