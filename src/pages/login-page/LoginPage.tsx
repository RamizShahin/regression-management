import styles from "./LoginPage.module.css";
import authService from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useState, FormEvent } from "react";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    const formValues = { email, password };
    const result = userSchema.safeParse(formValues);

    if (!result.success) {
      setErrorMessage(result.error.errors.map((e) => e.message).join("\n"));
      return;
    }

    try {
      await authService.login(email, password);
      navigate("/");
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
      console.error("Login failed", error);
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <form onSubmit={handleSubmit} noValidate>
          <label aria-hidden="true">Login</label>
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
