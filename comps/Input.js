export default props => (
  <div>
    <label htmlFor={props.placeholder}>{props.label}</label>
    <input
      type={props.type}
      onChange={props.onChange}
      id={props.placeholder}
      className="form-control"
      style={{ display: 'inline-block' }}
      placeholder={props.placeholder}
    />
  </div>
)
