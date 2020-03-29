import React, { FC } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { TextField, Button } from '@material-ui/core'
import styles from './changePassword.module.scss'

const ChangePassword: FC = () => {
  const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  }

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required.'),
    newPassword: Yup.string().required('New Password is required.'),
    confirmNewPassword: Yup.string().required(
      'Confirm New Password is required.',
    ),
  })

  const {
    handleSubmit,
    getFieldProps,
    resetForm,
    isSubmitting,
    errors,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      // TODO:
      resetForm()
    },
  })

  return (
    <article className={styles.paper}>
      <header className={styles.header}>
        <h2>Change Password</h2>
        <figure className={styles.img}>
          <img
            src="https://www.gstatic.com/identity/boq/accountsettingsmobile/signin_scene_1264x448_759b470ee2277f22a1907452a1522774.png"
            alt="Change Password"
          />
        </figure>
      </header>
      <form className={styles.customForm} onSubmit={handleSubmit}>
        <TextField
          className={styles.input}
          error={!!errors.oldPassword}
          helperText={errors.oldPassword}
          required
          label="Old Password"
          {...getFieldProps('oldPassword')}
        />
        <TextField
          className={styles.input}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          required
          label="New Password"
          {...getFieldProps('newPassword')}
        />
        <TextField
          className={styles.input}
          error={!!errors.confirmNewPassword}
          helperText={errors.confirmNewPassword}
          required
          label="Confirm New Password"
          {...getFieldProps('confirmNewPassword')}
        />
        <p className={styles.tip}>
          Make sure it's at least 15 characters OR at least 8 characters
          including a number and a lowercase letter.
        </p>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </form>
    </article>
  )
}

export default ChangePassword
