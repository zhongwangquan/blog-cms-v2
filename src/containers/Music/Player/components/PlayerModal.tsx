import React, { FC, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import * as Yup from 'yup'
import {
  Button,
  DialogActions,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  FormLabel,
  Switch,
} from '@material-ui/core'
import { useFormik } from 'formik'
import classNames from 'classnames'
import client from 'src/shared/apolloClient'
import { goBack, parseSearch } from 'src/shared/utils'
import Uploader from 'src/components/Uploader/Uploader'
import { UploaderRes } from 'src/components/Uploader/types'
import globalUseStyles from 'src/shared/styles'
import useStyles from '../styles'

interface Props {
  createPlayer: Function
  updatePlayerById: Function
}

const PlayerModal: FC<Props> = ({ createPlayer, updatePlayerById }) => {
  const { search } = useLocation()
  const { showModal, id } = parseSearch(search)

  const globalClasses = globalUseStyles()
  const classes = useStyles()

  const initialValues = {
    title: '',
    artist: '',
    lrc: '',
    coverUrl: '',
    musicFileUrl: '',
    isPublic: true,
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required.'),
    artist: Yup.string().required('Artist is required.'),
    lrc: Yup.string().required('LRC is required.'),
    coverUrl: Yup.string().required('CoverUrl is required.'),
    musicFileUrl: Yup.string().required('MusicFileUrl is required.'),
    isPublic: Yup.boolean().required('IsPublic is required.'),
  })

  const {
    handleSubmit,
    setFieldValue,
    getFieldProps,
    setValues,
    resetForm,
    isSubmitting,
    errors,
    values,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      if (id) {
        await updatePlayerById({
          variables: { input: { ...values, id } },
        })
      } else {
        await createPlayer({ variables: { input: values } })
      }
      goBack()
      resetForm()
    },
  })

  const onCoverUrlChange = (data: UploaderRes) => {
    setFieldValue('coverUrl', data.url)
  }

  const onMusicFileUrlChange = (data: UploaderRes) => {
    setFieldValue('musicFileUrl', data.url)
  }

  useEffect(() => {
    if (id) {
      const {
        title,
        artist,
        lrc,
        coverUrl,
        musicFileUrl,
        isPublic,
        // @ts-ignore
      } = client.cache.data.get(`PlayerModel:${id}`)
      setValues({
        title,
        artist,
        lrc,
        coverUrl,
        musicFileUrl,
        isPublic,
      })
    }

    return () => {
      resetForm()
    }
  }, [id, resetForm, setValues])

  return (
    <Dialog open={!!showModal} onClose={goBack}>
      <DialogTitle>{id ? 'Update' : 'Add'} an Music Track</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            To {id ? 'update' : 'add'} a Music Track, please enter the following
            fields here. We will send data after clicking the submit button.
          </DialogContentText>

          <TextField
            className={globalClasses.textFieldSpace}
            error={!!errors.title}
            helperText={errors.title}
            autoFocus
            required
            label="Title"
            fullWidth
            {...getFieldProps('title')}
          />

          <TextField
            className={globalClasses.textFieldSpace}
            error={!!errors.artist}
            helperText={errors.artist}
            required
            label="Artist"
            fullWidth
            {...getFieldProps('artist')}
          />

          <TextField
            className={globalClasses.textFieldSpace}
            error={!!errors.lrc}
            helperText={errors.lrc}
            required
            label="LRC"
            fullWidth
            multiline
            rows="10"
            {...getFieldProps('lrc')}
          />

          <div className={globalClasses.uploaderGroup}>
            <FormLabel required>CoverUrl</FormLabel>
            <TextField
              error={!!errors.coverUrl}
              helperText={errors.coverUrl}
              style={{ display: 'none' }}
              required
              label="Cover Url"
              fullWidth
              disabled={true}
              {...getFieldProps('coverUrl')}
            />
            <Uploader
              onChange={onCoverUrlChange}
              defaultFile={getFieldProps('coverUrl').value}
            />
          </div>

          <div
            className={classNames(
              globalClasses.uploaderGroup,
              classes.btnUploaderGroup,
            )}
          >
            <FormLabel required>MusicFileUrl</FormLabel>
            <TextField
              error={!!errors.musicFileUrl}
              helperText={errors.musicFileUrl}
              style={{ display: 'none' }}
              required
              label="MusicFileUrl"
              fullWidth
              disabled={true}
              {...getFieldProps('musicFileUrl')}
            />
            <Uploader
              onChange={onMusicFileUrlChange}
              type="simple"
              accept="audio/*"
              defaultFile={getFieldProps('musicFileUrl').value}
            />
          </div>

          <div className={globalClasses.uploaderGroup}>
            <FormLabel required>Is Public</FormLabel>
            <Switch
              color="primary"
              defaultChecked={values.isPublic || true}
              onChange={(e) =>
                setFieldValue('isPublic', e.target.checked, true)
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={goBack}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PlayerModal
