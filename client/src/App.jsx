import { useEffect, useState } from 'react';
import InputForm from './components/InputForm.jsx';
import PromptHistory from './components/PromptHistory.jsx';
import PromptOutput from './components/PromptOutput.jsx';

const createInitialForm = () => ({
  companyName: '',
  designTheme: ''
});

const HISTORY_KEY = 'stitchPromptHistory';

function normalizeFormData(source = {}) {
  return {
    companyName: source.companyName || '',
    designTheme: source.designTheme || source.companyTheme || ''
  };
}

function App() {
  const [formData, setFormData] = useState(createInitialForm);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      if (Array.isArray(savedHistory)) {
        setHistory(
          savedHistory.map((item) => ({
            ...item,
            designTheme: item.designTheme || item.formData?.designTheme || item.formData?.companyTheme || '',
            formData: normalizeFormData(item.formData)
          }))
        );
      }
    } catch {
      localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  const updateFormField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setValidationErrors((current) => ({ ...current, [field]: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.companyName.trim()) {
      nextErrors.companyName = 'Company name is required.';
    }

    if (!formData.designTheme.trim()) {
      nextErrors.designTheme = 'Website design theme is required.';
    }

    setValidationErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const savePromptToHistory = (prompt, sourceForm) => {
    const item = {
      id: crypto.randomUUID(),
      companyName: sourceForm.companyName.trim(),
      designTheme: sourceForm.designTheme.trim(),
      createdAt: new Date().toISOString(),
      prompt,
      formData: sourceForm
    };

    const nextHistory = [item, ...history].slice(0, 8);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    setHistory(nextHistory);
  };

  const generatePrompt = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-stitch-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to generate prompt.');
      }

      setGeneratedPrompt(data.prompt);
      savePromptToHistory(data.prompt, formData);
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong while generating the prompt.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData(createInitialForm());
    setGeneratedPrompt('');
    setError('');
    setValidationErrors({});
  };

  const loadHistoryItem = (item) => {
    if (item.formData) {
      setFormData(normalizeFormData(item.formData));
    }
    setGeneratedPrompt(item.prompt);
    setError('');
    setValidationErrors({});
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Stitch Prompt Automation Dashboard</p>
          <h1>Stitch Prompt Generator</h1>
          <p className="subtitle">
            Generate professional Stitch website design prompts using only a company name and design theme.
          </p>
        </div>
      </header>

      <section className="dashboard-grid" aria-label="Stitch prompt dashboard">
        <div className="panel form-panel">
          <InputForm
            formData={formData}
            validationErrors={validationErrors}
            isLoading={isLoading}
            onFieldChange={updateFormField}
            onGenerate={generatePrompt}
            onClear={clearForm}
          />
        </div>

        <aside className="output-column">
          <PromptOutput
            prompt={generatedPrompt}
            error={error}
            isLoading={isLoading}
            onRegenerate={generatePrompt}
            onClear={clearForm}
          />
          <PromptHistory history={history} onLoadPrompt={loadHistoryItem} />
        </aside>
      </section>
    </main>
  );
}

export default App;
