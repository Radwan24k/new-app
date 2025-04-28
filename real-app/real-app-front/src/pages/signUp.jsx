import { useFormik } from "formik";
import { Navigate, useNavigate } from "react-router";
import Joi from "joi";
import { toast } from "react-toastify";

import PageHeader from "../components/common/pageHeader";
import Input from "../components/common/input";
import { useAuth } from "../context/auth.context";
import usersService from "../services/usersService";

function SignUp() {
  const navigate = useNavigate();
  const { user, login: loginUser } = useAuth();

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      name: {
        // Nested structure
        first: "",
        middle: "",
        last: "",
      },
      phone: "",
      email: "",
      password: "",
      image: {
        // Nested structure
        url: "",
        alt: "",
      },
      address: {
        // Nested structure
        state: "",
        country: "",
        city: "",
        street: "",
        houseNumber: "", // Keep as string for input
        zip: "", // Keep as string for input
      },
      isBusiness: false,
    },
    validate(values) {
      const schema = Joi.object({
        name: Joi.object({
          // Nested validation
          first: Joi.string().min(2).max(256).required().label("First Name"),
          middle: Joi.string()
            .min(2)
            .max(256)
            .optional()
            .allow("")
            .label("Middle Name"),
          last: Joi.string().min(2).max(256).required().label("Last Name"),
        }).required(),
        phone: Joi.string()
          .min(9)
          .max(11)
          .required()
          .pattern(/^0[5-9][0-9]{7,8}$/)
          .label("Phone")
          .messages({
            "string.pattern.base":
              '"Phone" must be a valid Israeli phone number',
          }),
        email: Joi.string()
          .min(5)
          .max(255)
          .required()
          .email({ tlds: false })
          .label("Email"),
        password: Joi.string()
          .min(9)
          .max(20)
          .pattern(
            new RegExp(
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@%$#^&*\\-_*()])[A-Za-z\\d!@%$#^&*\\-_*()]{9,}$"
            )
          )
          .required()
          .label("Password")
          .messages({
            "string.pattern.base":
              "Password must be at least 9 characters long and contain an uppercase letter, a lowercase letter, a number, and one of these special characters: !@%$#^&*-_*()",
          }),
        image: Joi.object({
          url: Joi.string()
            .min(14)
            .max(1024)
            .uri()
            .allow("")
            .label("Image URL"),
          alt: Joi.string().min(2).max(256).allow("").label("Image Alt"),
        }).required(),
        address: Joi.object({
          state: Joi.string().min(0).max(256).allow("").label("State"),
          country: Joi.string().min(2).max(256).required().label("Country"),
          city: Joi.string().min(2).max(256).required().label("City"),
          street: Joi.string().min(2).max(256).required().label("Street"),
          houseNumber: Joi.number().min(1).required().label("House Number"),
          zip: Joi.number().integer().required().label("Zip"),
        }).required(),
        isBusiness: Joi.boolean().required(),
      });

      const valuesToValidate = {
        ...values,
        address: {
          ...values.address,
          houseNumber: values.address.houseNumber
            ? Number(values.address.houseNumber)
            : undefined,
          zip: values.address.zip ? Number(values.address.zip) : undefined,
        },
      };

      const { error } = schema.validate(valuesToValidate, {
        abortEarly: false,
      });

      if (!error) {
        return null;
      }

      const errors = {};
      for (const detail of error.details) {
        const path = detail.path;
        let current = errors;
        for (let i = 0; i < path.length - 1; i++) {
          if (!current[path[i]]) {
            current[path[i]] = {};
          }
          current = current[path[i]];
        }
        current[path[path.length - 1]] = detail.message;
      }
      // *** Improved Logging ***
      console.log("Validation Errors:", JSON.stringify(errors, null, 2));
      return errors;
    },
    onSubmit: async (values) => {
      try {
        // Construct the payload matching the API structure
        const body = {
          name: {
            first: values.name.first,
            middle: values.name.middle || "", // Ensure middle is sent even if empty
            last: values.name.last,
          },
          phone: values.phone,
          email: values.email,
          password: values.password,
          image: {
            url: values.image.url || "", // Ensure URL is sent even if empty
            alt: values.image.alt || "", // Ensure Alt is sent even if empty
          },
          address: {
            state: values.address.state || "", // Ensure state is sent even if empty
            country: values.address.country,
            city: values.address.city,
            street: values.address.street,
            // Convert to numbers for submission as required by API
            houseNumber: Number(values.address.houseNumber),
            zip: Number(values.address.zip),
          },
          isBusiness: values.isBusiness,
        };

        console.log("Submitting user data:", JSON.stringify(body, null, 2)); // Log the structured data being sent clearly

        // *** Wait for user creation to succeed ***
        await usersService.createUser(body);
        toast.info("Registration request sent successfully."); // Indicate signup part finished

        // *** Only attempt login AFTER successful creation ***
        try {
          console.log("Attempting auto-login...");
          await loginUser({ email: body.email, password: body.password });
          toast.success("Successfully registered and logged in!");
          navigate("/");
        } catch (loginError) {
          console.error(
            "Auto-login after signup failed:",
            loginError.response || loginError
          ); // Log login specific error
          toast.warn(
            "Registration successful, but auto-login failed. Please sign in manually."
          );
          navigate("/sign-in"); // Redirect to sign-in page if auto-login fails
        }
      } catch (signupError) {
        // Catch errors specifically from createUser
        console.error(
          "Signup Error Response:",
          signupError.response || signupError
        ); // Log the full error response for debugging
        const response = signupError.response;
        if (response && response.status === 400) {
          // Try to extract specific message from API if available
          let errorMessage = "Registration failed. Please check your input.";
          if (typeof response.data === "string") {
            errorMessage = response.data; // API might return plain text error
          } else if (
            response.data &&
            typeof response.data.message === "string"
          ) {
            errorMessage = response.data.message; // API might return { message: "..." }
          } else if (
            typeof response.data === "object" &&
            response.data !== null
          ) {
            // Attempt to stringify if it's an object (might contain more details)
            try {
              errorMessage = JSON.stringify(response.data);
            } catch (e) {
              /* ignore stringify error */
            }
          }
          toast.error(`Registration Error: ${errorMessage}`);
        } else {
          toast.error("An unexpected error occurred during registration.");
          console.error(response); // Log other unexpected errors
        }
      }
    },
  });

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <PageHeader title="Register" description="Create a new account" />

      <form onSubmit={form.handleSubmit} noValidate autoComplete="off">
        {/* Removed serverError display */}

        <div className="row">
          {/* Left Column */}
          <div className="col-md-6">
            <Input
              {...form.getFieldProps("name.first")} // Nested path
              error={form.touched.name?.first && form.errors.name?.first} // Optional chaining
              type="text"
              label="First Name"
              placeholder="John"
              required
            />
            <Input
              {...form.getFieldProps("name.last")} // Nested path
              error={form.touched.name?.last && form.errors.name?.last} // Optional chaining
              type="text"
              label="Last Name"
              placeholder="Doe"
              required
            />
            <Input
              {...form.getFieldProps("email")}
              error={form.touched.email && form.errors.email}
              type="email"
              label="Email"
              placeholder="john@doe.com"
              required
            />
            <Input
              {...form.getFieldProps("image.url")} // Nested path
              error={form.touched.image?.url && form.errors.image?.url} // Optional chaining
              type="text" // Keep as text, validated as URI
              label="Image URL"
              placeholder="https://example.com/image.jpg"
            />
            <Input
              {...form.getFieldProps("address.state")} // Nested path
              error={form.touched.address?.state && form.errors.address?.state} // Optional chaining
              type="text"
              label="State"
              placeholder="California"
            />
            <Input
              {...form.getFieldProps("address.city")} // Nested path
              error={form.touched.address?.city && form.errors.address?.city} // Optional chaining
              type="text"
              label="City"
              placeholder="Los Angeles"
              required
            />
            <Input
              {...form.getFieldProps("address.houseNumber")} // Nested path
              error={
                form.touched.address?.houseNumber &&
                form.errors.address?.houseNumber
              } // Optional chaining
              type="text" // Keep as text for input flexibility
              label="House Number"
              placeholder="123"
              required
            />
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <Input
              {...form.getFieldProps("name.middle")} // Nested path
              error={form.touched.name?.middle && form.errors.name?.middle} // Optional chaining
              type="text"
              label="Middle Name"
              placeholder="M"
            />
            <Input
              {...form.getFieldProps("phone")}
              error={form.touched.phone && form.errors.phone}
              type="tel" // Use type="tel" for phone numbers
              label="Phone"
              placeholder="050-0000000"
              required
            />
            <Input
              {...form.getFieldProps("password")}
              error={form.touched.password && form.errors.password}
              type="password"
              label="Password"
              required
            />
            <Input
              {...form.getFieldProps("image.alt")} // Nested path
              error={form.touched.image?.alt && form.errors.image?.alt} // Optional chaining
              type="text"
              label="Image Alt"
              placeholder="A descriptive alt text"
            />
            <Input
              {...form.getFieldProps("address.country")} // Nested path
              error={
                form.touched.address?.country && form.errors.address?.country
              } // Optional chaining
              type="text"
              label="Country"
              placeholder="USA"
              required
            />
            <Input
              {...form.getFieldProps("address.street")} // Nested path
              error={
                form.touched.address?.street && form.errors.address?.street
              } // Optional chaining
              type="text"
              label="Street"
              placeholder="Main St"
              required
            />
            <Input
              {...form.getFieldProps("address.zip")} // Nested path
              error={form.touched.address?.zip && form.errors.address?.zip} // Optional chaining
              type="text" // Keep as text for input flexibility
              label="Zip"
              placeholder="90001"
              required // Added required based on API spec
            />
          </div>
        </div>

        {/* isBusiness Checkbox */}
        <div className="row mt-3">
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="isBusinessCheckbox"
                {...form.getFieldProps("isBusiness")}
                checked={form.values.isBusiness}
              />
              <label className="form-check-label" htmlFor="isBusinessCheckbox">
                Register as Business
              </label>
            </div>
            {/* Error display for checkbox if needed */}
            {form.touched.isBusiness && form.errors.isBusiness && (
              <div className="text-danger mt-1">{form.errors.isBusiness}</div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => navigate("/")} // Navigate back
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-info"
            onClick={() => form.resetForm()} // Use formik's resetForm
          >
            <i className="bi bi-arrow-clockwise"></i> Reset
          </button>
          <button
            type="submit"
            disabled={!form.isValid}
            className="btn btn-primary" // Changed to primary for submit action
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
