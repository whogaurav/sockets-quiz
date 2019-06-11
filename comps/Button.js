import Link from 'next/link'

export default props => (
  <div>
    {props.nextNavigateLink ? (
      <Link href={props.nextNavigateLink}>
        <button
          style={props.style}
          onClick={props.onClick}
          value={props.value}
          type="button"
          className={props.className ? props.className + ' btn btn-primary' : 'btn btn-primary'}
        >
          {props.title}
        </button>
      </Link>
    ) : (
      <button style={props.style} onClick={props.onClick} value={props.value} type="button" className="btn btn-primary">
        {props.title}
      </button>
    )}
  </div>
)
