// footer.jsx

import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      Made with&nbsp;
      <img src={`${import.meta.env.BASE_URL}icons/heart.svg`} alt="heartIcon" />
      &nbsp;by&nbsp;
      <a href="https://github.com/aswin-vs" target="_blank" rel="noreferrer">
        <span>Aswin V S</span>
      </a>
    </footer>
  )
}

export default Footer;