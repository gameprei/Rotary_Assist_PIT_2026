import './FormButtonSecondary.css';

function FormButtonSecondary({ type = "button", children }) {
  return (
    <button type={type} className="btn-secondary">
      {children}
    </button>
  );
}

export default FormButtonSecondary;