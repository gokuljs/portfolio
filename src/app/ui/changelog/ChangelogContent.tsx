import styles from '@styles/changelog.module.scss';
import { ChangelogContentBlock } from '../../../data/changelog';

interface ChangelogContentProps {
  content: ChangelogContentBlock[];
}

export default function ChangelogContent({ content }: ChangelogContentProps) {
  const renderContentBlock = (block: ChangelogContentBlock, index: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <div
            key={index}
            className={`${styles.contentBlock} ${styles.paragraph}`}
          >
            <p>{block.content}</p>
          </div>
        );

      case 'heading':
        return (
          <div
            key={index}
            className={`${styles.contentBlock} ${styles.heading}`}
          >
            <h3>{block.content}</h3>
          </div>
        );

      case 'list':
        return (
          <div key={index} className={`${styles.contentBlock} ${styles.list}`}>
            <ul>
              {block.items?.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        );

      case 'code':
        return (
          <div key={index} className={`${styles.contentBlock} ${styles.code}`}>
            <pre>
              <code>{block.content}</code>
            </pre>
          </div>
        );

      case 'image':
        return (
          <div key={index} className={`${styles.contentBlock} ${styles.image}`}>
            <img src={block.content} alt={block.caption || ''} />
            {block.caption && (
              <div className={styles.caption}>{block.caption}</div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.entryContent}>
      {content.map((block, index) => renderContentBlock(block, index))}
    </div>
  );
}
