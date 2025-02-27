import styles from "./LoginPage.module.css";
import authService from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function LoginPage() {
  const navigate = useNavigate();

  async function loginAction(formData: FormData) {
    const formValues = Object.fromEntries(formData);
    const result = userSchema.safeParse(formValues);

    if (!result.success) {
      alert(result.error.errors.map((e) => e.message).join("\n"));
      return;
    }

    const { email, password } = result.data;

    try {
      await authService.login(email, password);
      navigate("/");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
      console.error("Login failed", error);
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <form action={loginAction}>
          <label aria-hidden="true">Login</label>
          <input type="email" name="email" placeholder="Email" required />
          <input
            type="password"
            name="password"
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
