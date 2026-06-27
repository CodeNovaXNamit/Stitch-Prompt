function formatDate(value) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  } catch {
    return 'Recent';
  }
}

function PromptHistory({ history, onLoadPrompt }) {
  return (
    <section className="panel history-panel">
      <div className="panel-heading">
        <div>
          <h2>Recent Prompts</h2>
          <p>Reload a previous generated prompt from this browser.</p>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="history-empty">No saved prompts yet.</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <button className="history-item" type="button" key={item.id} onClick={() => onLoadPrompt(item)}>
              <span>
                <strong>{item.companyName || 'Untitled Company'}</strong>
                <small>{item.designTheme || 'Design theme not provided'}</small>
              </span>
              <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default PromptHistory;
