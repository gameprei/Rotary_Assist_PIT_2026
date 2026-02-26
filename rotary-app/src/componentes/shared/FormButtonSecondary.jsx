import './FormButtonSecondary.css'

function FormButtonSecondary(props) {
  return (
    <button type="button" className="btn-secondary">
      {props.placeholder}
    </button>
  );
}

export default FormButtonSecondary;
