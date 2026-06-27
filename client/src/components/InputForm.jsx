const fieldConfig = [
  {
    name: 'companyName',
    label: 'Company Name',
    type: 'input',
    required: true,
    placeholder: 'Maa Hydro Engineers'
  },
  {
    name: 'designTheme',
    label: 'Website Design Theme / Color Theme',
    type: 'textarea',
    required: true,
    placeholder:
      'Modern industrial website, blue and grey color palette, professional B2B feel, clean layout, strong trust factor, premium engineering look.'
  }
];

function InputForm({
  formData,
  validationErrors,
  isLoading,
  onFieldChange,
  onGenerate,
  onClear
}) {
  return (
    <form
      className="input-form"
      onSubmit={(event) => {
        event.preventDefault();
        onGenerate();
      }}
    >
      <div className="panel-heading">
        <div>
          <h2>Prompt Details</h2>
          <p>Enter the company name and creative direction. Gemini will build the complete Stitch prompt.</p>
        </div>
      </div>

      <div className="field-list">
        {fieldConfig.map((field) => (
          <label className="field" key={field.name}>
            <span>
              {field.label}
              {field.required && <strong aria-label="required"> *</strong>}
            </span>

            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.name]}
                placeholder={field.placeholder}
                rows={6}
                onChange={(event) => onFieldChange(field.name, event.target.value)}
              />
            ) : (
              <input
                value={formData[field.name]}
                placeholder={field.placeholder}
                onChange={(event) => onFieldChange(field.name, event.target.value)}
              />
            )}

            {validationErrors[field.name] && (
              <small className="field-error">{validationErrors[field.name]}</small>
            )}
          </label>
        ))}
      </div>

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Generating...
            </>
          ) : (
            'Generate Stitch Prompt'
          )}
        </button>
        <button className="secondary-button" type="button" onClick={onClear} disabled={isLoading}>
          Clear Form
        </button>
      </div>
    </form>
  );
}

export default InputForm;
