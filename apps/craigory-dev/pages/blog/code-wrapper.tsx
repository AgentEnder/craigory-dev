import './code-wrapper.scss';

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
        <div
          className='code-tabs'
        >
          {props.filename ? (
            <div
              className='filename'
            >
              {props.filename}
            </div>
          ) : null}
        </div>
      ) : null}
      <pre
        style={{
          marginTop: 0,
        }}
        className={`code-wrapper ${props.filename ? 'has-filename' : ''}`}
      >
        {children}
      </pre>
    </div>
  );
}
