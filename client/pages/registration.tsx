import axios from "axios";
import { Box, Button, Form, FormField, TextInput } from "grommet";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Registration.module.scss";

interface IFormData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const initialState = {
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

const Registration: NextPage = () => {
  const [formData, setFormData] = useState<IFormData>(initialState);
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = (value: IFormData) => {
    if (formData.password !== formData.passwordConfirm) {
      setError(true);
      return;
    }
    axios
      .post("http://localhost:3000/api/users", formData)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => console.log("error:", e));
  };

  const handleReset = () => {
    setFormData(initialState);
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.register}>Register</h1>
        <Form
          className={styles.form}
          value={formData}
          onChange={(value) => setFormData(value)}
          onReset={handleReset}
          onSubmit={({ value }) => handleSubmit(value)}
        >
          <FormField name="username" label="Username">
            <TextInput name="username" />
          </FormField>
          <FormField name="email" label="Email">
            <TextInput name="email" />
          </FormField>
          <FormField name="password" label="Password">
            <TextInput name="password" />
          </FormField>
          <FormField name="passwordConfirm" label="Confirm your password">
            <TextInput name="passwordConfirm" />
          </FormField>
          <Box className={styles.buttonGroup} direction="row" gap="medium">
            <Button type="submit" primary label="Submit" />
            <Button type="reset" secondary label="Reset" />
          </Box>
        </Form>
        <Link href="/login">
          <p className={styles.account}>Already have an account? Login</p>
        </Link>
      </main>
    </div>
  );
};

export default Registration;
