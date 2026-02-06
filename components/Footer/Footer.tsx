import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: ArtZam</p>
          <p>
            Contact us:{" "}
            <a href="https://www.linkedin.com/in/artem-zamrii/?_l=uk_UA" target="_blank">Linkedin</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
