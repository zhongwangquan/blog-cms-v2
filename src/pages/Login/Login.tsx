import React, { FC } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useLazyQuery } from '@apollo/react-hooks'
import { CircularProgress } from '@material-ui/core'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import classNames from 'classnames'
import { LOGIN } from './typeDefs'
import styles from './Login.module.scss'

const Login: FC = () => {
  const history = useHistory()

  const initialValues = {
    email: '',
    password: '',
  }

  const [login, { called, loading }] = useLazyQuery(LOGIN, {
    notifyOnNetworkStatusChange: true,
    onCompleted(data) {
      window.localStorage.setItem('token', data.login.authorization)
      history.push('/')
    },
  })

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required('This field is required.'),
    password: Yup.string().required('This field is required.'),
  })

  const { handleSubmit, getFieldProps, resetForm, errors } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      login({
        variables: { input: values },
      })
      resetForm()
    },
  })

  return (
    <main className={styles.loginWrapper} id="xxxx">
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.header}>Welcome back!</div>
        <div className={styles.headerExtra}>
          We're so excited to see you again!
        </div>
        <label htmlFor="email" className={styles.label}>
          {errors.email ? (
            <span className={styles.error}>
              Email - <span className={styles.errorMsg}>{errors.email}</span>
            </span>
          ) : (
            'Email'
          )}
          <input
            id="email"
            type="text"
            className={classNames(
              { [styles.errorInputTxt]: errors.email },
              styles.inputTxt,
            )}
            {...getFieldProps('email')}
          />
        </label>

        <label htmlFor="password" className={styles.label}>
          {errors.password ? (
            <span className={styles.error}>
              Password -
              <span className={styles.errorMsg}>{errors.password}</span>
            </span>
          ) : (
            'Password'
          )}
          <input
            id="password"
            type="password"
            className={classNames(
              { [styles.errorInputTxt]: errors.password },
              styles.inputTxt,
            )}
            {...getFieldProps('password')}
          />
        </label>
        <p className={styles.link}>Forgot your password?</p>

        <button
          className={styles.submitBtn}
          type="submit"
          disabled={called && loading}
        >
          {called && loading ? <CircularProgress size={30} /> : 'Login'}
        </button>

        <>
          <span className={styles.registerTip}>Need an account?</span>

          <span className={styles.link}>
            <Link to="/register"> Register</Link>
          </span>
        </>
      </form>
    </main>
  )
}

export default Login
