import Link from 'next/link'
// import fetch from 'isomorphic-unfetch'

const linkStyle = {
  marginRight: 15
}

const Header = () => (
  <div>
    <Link href="/">
      <a style={linkStyle}>Home</a>
    </Link>
    <Link href="/about">
      <a style={linkStyle}>About</a>
    </Link>
    <Link href="/example">
      <a style={linkStyle}>Example</a>
    </Link>
  </div>
)

export default Header
