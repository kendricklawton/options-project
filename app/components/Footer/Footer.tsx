import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
    return (

        <div className={styles.footer}>
            <div className={styles.leading}>
                <p>
                    © 2025 Machine Name LLC
                </p>
            </div>
            <div className={styles.trailing}>
                <Link href="/contact">Contact</Link>
                <p>|</p>
                <Link href="/legal">Legal</Link>
            </div>
        </div>

    )
};