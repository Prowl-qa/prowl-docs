import React, {useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import styles from './styles.module.css';

type Sentiment = 'negative' | 'neutral' | 'positive';

const EMOJIS: {value: Sentiment; label: string; icon: string}[] = [
  {value: 'negative', label: 'This page was not helpful', icon: '\uD83D\uDE1E'},
  {value: 'neutral', label: 'This page was somewhat helpful', icon: '\uD83D\uDE10'},
  {value: 'positive', label: 'This page was helpful', icon: '\uD83D\uDE0A'},
];

export default function DocFeedback(): React.ReactElement | null {
  const {siteConfig} = useDocusaurusContext();
  const location = useLocation();
  const feedbackApiUrl = siteConfig.customFields?.feedbackApiUrl as
    | string
    | undefined;

  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!feedbackApiUrl) return null;

  async function handleSubmit() {
    if (!sentiment || submitting) return;
    setSubmitting(true);
    try {
      await fetch(feedbackApiUrl!, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          page: location.pathname,
          sentiment,
          comment: comment.trim().slice(0, 1000) || null,
        }),
      });
    } catch {
      // Silent fail — feedback is best-effort
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.thanks}>Thanks for your feedback!</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Was this page helpful?</p>
      <div className={styles.emojis}>
        {EMOJIS.map((e) => (
          <button
            key={e.value}
            type="button"
            className={`${styles.emojiBtn}${sentiment === e.value ? ` ${styles.emojiBtnSelected}` : ''}`}
            onClick={() => setSentiment(e.value)}
            aria-label={e.label}>
            {e.icon}
          </button>
        ))}
      </div>
      <div
        className={`${styles.commentSection}${sentiment ? ` ${styles.commentSectionOpen}` : ''}`}>
        <div className={styles.commentInner}>
          <textarea
            className={styles.textarea}
            placeholder="Any additional feedback? (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
          />
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={submitting}>
            {submitting ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
