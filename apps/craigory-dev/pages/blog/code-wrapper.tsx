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
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1em',
            padding: '0.5em 0.5em 0 0.5em',
            borderRadius: '8px 8px 0 0',
            border: '2px solid black',
            backgroundColor: '#3a3a5a',
            boxShadow: '0 4px 8px #000000e8',
          }}
        >
          {props.filename ? (
            <div
              style={{
                backgroundColor: '#282b2e',
                borderRadius: '0.5em 0.5em 0 0',
                padding: '0.5em',
                color: '#f8f8f2',
                border: '2px solid black',
                borderBottom: 'none',
              }}
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
        className={`${props.filename ? 'has-filename' : ''}`}
      >
        {children}
      </pre>
    </div>
  );
}
