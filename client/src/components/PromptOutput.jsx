import { useState } from 'react';

function PromptOutput({ prompt, error, isLoading, onRegenerate, onClear }) {
  const [copyStatus, setCopyStatus] = useState('');

  const copyPrompt = async () => {
    if (!prompt) {
      return;
    }

    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus('Copied');
      window.setTimeout(() => setCopyStatus(''), 1600);
    } catch {
      setCopyStatus('Copy failed');
      window.setTimeout(() => setCopyStatus(''), 1600);
    }
  };

  return (
    <section className="panel output-panel" aria-live="polite">
      <div className="panel-heading output-heading">
        <div>
          <h2>Generated Prompt</h2>
          <p>Copy the finished prompt and paste it directly into Stitch.</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className={`prompt-box ${!prompt || isLoading ? 'prompt-box-empty' : ''}`}>
        {isLoading ? (
          <div className="loading-state">
            <span className="spinner large" aria-hidden="true" />
            <p>Gemini is preparing a professional Stitch prompt...</p>
          </div>
        ) : prompt ? (
          <pre>{prompt}</pre>
        ) : (
          <div className="empty-state">
            <h3>Your generated prompt will appear here.</h3>
            <p>Enter a company name and design theme to generate a complete Stitch prompt.</p>
          </div>
        )}
      </div>

      <div className="output-actions">
        <button className="primary-button" type="button" onClick={copyPrompt} disabled={!prompt || isLoading}>
          {copyStatus || 'Copy Prompt'}
        </button>
        <button className="secondary-button" type="button" onClick={onRegenerate} disabled={isLoading}>
          Regenerate
        </button>
        <button className="ghost-button" type="button" onClick={onClear} disabled={isLoading}>
          Clear Form
        </button>
      </div>
    </section>
  );
}

export default PromptOutput;
