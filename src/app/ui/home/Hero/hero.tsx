import styles from '@styles/hero.module.scss';
import SocialDock from '../../components/SocialDock/SocialDock';
import { Spotlight } from '@/components/ui/spotlight-new';
import { SkillGraph } from '@/components/ui/skill-graph';

const Hero: React.FC = () => {
  return (
    <div className={styles.hero}>
      <div className="hidden md:block">
        <Spotlight
          gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .12) 0, hsla(210, 100%, 55%, .04) 50%, hsla(210, 100%, 45%, 0) 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .03) 80%, transparent 100%)"
          gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)"
          translateY={-350}
          width={560}
          height={1380}
          smallWidth={240}
          duration={6}
          xOffset={140}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <div className={styles.mainTextContainer}>
            <h1 className={styles.mainText}>
              <div>GOKUL JS</div>
              <div>EX - YC</div>
              <div>GENERALIST</div>
              <div>DEVELOPER</div>
            </h1>
          </div>

          <div className={styles.descriptionContainer}>
            <p className={styles.description}>
              Former founding engineer and creative generalist with a track
              record of turning early-stage ideas into real products. Built
              scalable web platforms, intelligent agent systems, and real-time
              voice pipelines. Thrives in fast-moving environments where speed
              matters and ownership is everything.
            </p>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.graphContainer}>
            <SkillGraph />
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p className={styles.tagline}>
          Let's create something incredible together.
        </p>
        <p className={styles.email}>jsgokul123@gmail.com</p>
      </footer>
      <SocialDock />
    </div>
  );
};

export default Hero;
