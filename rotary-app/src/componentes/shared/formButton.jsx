import "./formButton.css";

function FormButton(props) {
  return (
    <button type={props.type || "button"} className="btn-primary">
      {props.placeholder}
    </button>
  );
}

export default FormButton;
