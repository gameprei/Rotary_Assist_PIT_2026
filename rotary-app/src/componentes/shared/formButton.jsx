import "./formButton.css";

function FormButton({ type = "button", children }) {
  return (
    <button type={type} className="btn-primary">
      {children}
    </button>
  );
}

export default FormButton;