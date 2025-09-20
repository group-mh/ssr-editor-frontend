import "../../style/Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <p>&copy; Grupp M & H {new Date().getFullYear()} SSR Editor</p>
        </footer>
    );
}

export default Footer;