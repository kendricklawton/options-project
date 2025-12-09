'use client';

import styles from '../page.module.css';

export default function Legal() {
    return (
        <div className={styles.page}>
            <div className={styles.wrapperGap}>
                <h1>Legal</h1>

                <div>
                    <h2>Terms of Use</h2>
                    <br/>
                    <h3>1. Introduction</h3>
                    <p>Welcome to Options Project, a platform provided by Machine Name LLC. By accessing or using our application, you agree to be bound by these Terms of Use. If you do not agree, please do not use our services.</p>
                    <br />
                    <h3>2. No Financial Advice</h3>
                    <p>Options Project is an educational and research platform for options trading. We do not provide financial, investment, or legal advice. You acknowledge that any information provided within the application is for educational purposes only.</p>
                    <br />
                    <h3>3. User Accounts</h3>
                    <p>To access certain features, you may need to create an account. You agree to provide accurate information and maintain the security of your account credentials.</p>
                    <br />
                    <h3>4. Data Collection & Usage</h3>
                    <p>We collect user data, including analytics and authentication information, to improve our services. Please refer to our Privacy Policy for details.</p>
                    <br />
                    <h3>5. Prohibited Conduct</h3>
                    <p>Users may not use our application for unlawful purposes, to manipulate financial markets, or engage in fraudulent activities.</p>
                    <br />
                    <h3>6. Limitation of Liability</h3>
                    <p>Machine Name LLC is not responsible for any losses, damages, or liabilities arising from the use of our platform.</p>
                </div>

                <div>
                    <h2>Privacy Policy</h2>
                    <br/>
                    <h3>1. Information We Collect</h3>
                    <p>We collect personal information such as email addresses, authentication details, and analytics data. We may also collect third-party tracking data.</p>
                    <br />
                    <h3>2. How We Use Your Data</h3>
                    <p>We use collected data to improve application functionality, enhance user experience, and ensure security.</p>
                    <br />
                    <h3>3. Data Sharing</h3>
                    <p>We do not sell or share personal data with third parties except for necessary service providers and legal compliance.</p>
                    <br />
                    <h3>4. User Rights</h3>
                    <p>Users may request access, modification, or deletion of their data by contacting us.</p>
                    <br />
                    <h3>5. Security</h3>
                    <p>We implement security measures to protect user data but cannot guarantee complete security.</p>
                </div>

                <div>
                    <h2>Cookie Policy</h2>
                    <br/>
                    <h3>1. What Are Cookies?</h3>
                    <p>Cookies are small data files stored on your device to enhance your browsing experience.</p>
                    <br/>
                    <h3>2. How We Use Cookies</h3>
                    <p>We use cookies for authentication, analytics, and improving user experience.</p>
                    <br/>
                    <h3>3. Managing Cookies</h3>
                    <p>Users can disable cookies through their browser settings, but some features may not function properly.</p>
                </div>

                <div>
                    <h2>Contact</h2>
                    <p>For any questions, contact us at info@machinename.io</p>
                </div>
            </div>
        </div>
    );
}