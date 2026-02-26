function FormInput(props) {
  return (
    <div>
      <input
        id={props.id}
        type={props.type}
        className={`form-control ${props.isInvalid ? 'is-invalid' : ''}`}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        required
      />
      <div className="invalid-feedback">
        {props.invalidFeedback}
      </div>
    </div>
  );
}

export default FormInput;