import React, { useState, FormEvent } from "react";
import styles from './ForgotPasswordStyles.module.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage("If this email is registered, a reset link has been sent.");
    setEmail("");
  };

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>Reset Password</label>
          <p className={styles.paragraph}>
            Enter your email address to receive a password reset link.
          </p>
          {message && <div className={styles.error}>{message}</div>}
          <input
            type="email"
            placeholder="Enter your email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className={styles.button}>
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
