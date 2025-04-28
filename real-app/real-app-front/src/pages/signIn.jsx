import { useFormik } from "formik";
import { Navigate, useLocation, useNavigate } from "react-router";
import Joi from "joi";
import { toast } from "react-toastify";

import { useAuth } from "../context/auth.context";
import PageHeader from "../components/common/pageHeader";
import Input from "../components/common/input";

function SignIn() {
  const location = useLocation();

  const { login, user } = useAuth();

  const navigate = useNavigate();

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      email: "",
      password: "",
    },
    validate(values) {
      const schema = Joi.object({
        email: Joi.string()
          .min(5) // API spec says min 5 for login email
          .max(255)
          .required()
          .email({ tlds: false })
          .label("Email"),
        // Updated password validation to match API spec (min 9, complex)
        password: Joi.string()
          .min(9) // API spec says min 9
          .max(1024) // Keep a reasonable max
          .pattern(
            new RegExp(
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@%$#^&*\\-_*()])[A-Za-z\\d!@%$#^&*\\-_*()]{9,}$"
            )
          )
          .required()
          .label("Password")
          .messages({
            "string.pattern.base":
              '"Password" must be at least nine characters long and contain an uppercase letter, a lowercase letter, a number and one of the following characters !@%$#^&*-_*()',
          }),
      });

      const { error } = schema.validate(values, { abortEarly: false });

      if (!error) {
        return null;
      }

      const errors = {};
      for (const detail of error.details) {
        errors[detail.path[0]] = detail.message;
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        await login(values);
        toast.success("Successfully signed in!");

        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } catch ({ response }) {
        if (response && response.status === 400) {
          toast.error(response.data || "Invalid email or password.");
        } else {
          toast.error("An unexpected error occurred during sign in.");
          console.error(response);
        }
      }
    },
  });

  if (user) {
    return <Navigate to={location.state?.from?.pathname ?? "/"} />;
  }

  return (
    <div className="container">
      <PageHeader title="Sign In" description="Sign in with your account" />

      <div className="row justify-content-center mt-4">
        <div className="col-md-5">
          <form onSubmit={form.handleSubmit} noValidate autoComplete="off">
            <Input
              {...form.getFieldProps("email")}
              error={form.touched.email && form.errors.email}
              type="email"
              label="Email"
              placeholder="john@doe.com"
              required
            />
            <Input
              {...form.getFieldProps("password")}
              error={form.touched.password && form.errors.password}
              type="password"
              label="Password"
              required
            />

            <div className="my-2">
              <button
                disabled={!form.isValid}
                type="submit"
                className="btn btn-primary"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
