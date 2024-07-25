import styles from './code-wrapper.module.scss';

export function CodeWrapper({
  children,
  ...props
}: {
  children: React.ReactNode;
  filename?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {props.filename ? (
        <div className={styles['code-tabs']}>
          {props.filename ? (
            <div className={styles['filename']}>{props.filename}</div>
          ) : null}
        </div>
      ) : null}

      <pre
        style={{
          marginTop: 0,
        }}
        className={[
          styles['code-wrapper'],
          props.filename ? styles['has-filename'] : '',
        ].join(' ')}
      >
        {children}
      </pre>
    </div>
  );
}
