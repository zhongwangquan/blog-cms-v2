import React, { FC, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { RootState } from 'typesafe-actions'
import {
  getAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from 'stores/announcement/actions'
import MUIDataTable, {
  MUIDataTableOptions,
  MUIDataTableColumn,
} from 'mui-datatables'
import { DeleteOutline, Edit, AddBox } from '@material-ui/icons'
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  FormControl,
  Popper,
  Fade,
  Paper,
  Fab,
} from '@material-ui/core'
import TableWrapper from 'components/TableWrapper/TableWrapper'
import Loading from 'components/Loading/Loading'
import { formatISODate } from 'shared/utils'
import styles from './Announcement.module.scss'

const mapStateToProps = (state: RootState) => {
  const {
    announcements: { announcements },
  } = state

  return {
    announcements: announcements.allIds.map(id => announcements.byId[id]),
    byId: announcements.byId,
    isFetching: announcements.isFetching,
  }
}

const mapDispatchToProps = {
  getAnnouncements: getAnnouncements.request,
  addAnnouncement: addAnnouncement.request,
  updateAnnouncement: updateAnnouncement.request,
  deleteAnnouncement: deleteAnnouncement.request,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const Announcement: FC<Props> = ({
  isFetching,
  announcements,
  byId,
  getAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
}) => {
  useEffect(() => {
    getAnnouncements()
  }, [getAnnouncements])

  const [curId, setCurId] = useState('')

  // Form
  const [announcementValue, setAnnouncementValue] = useState('')
  const handleAnnouncementChange = (e: any) => {
    setAnnouncementValue(e.target.value)
  }

  // Modal
  const [open, setOpen] = useState(false)
  const onModalOpen = (id?: string) => {
    setOpen(true)
    if (id) {
      setCurId(id)
      setAnnouncementValue(byId[id].announcement)
    }
  }
  const onModalClose = () => {
    setCurId('')
    setOpen(false)
    setAnnouncementValue('')
  }
  const onModalSubmit = () => {
    if (curId) {
      updateAnnouncement({ id: curId, announcement: announcementValue })
    } else {
      addAnnouncement({ announcement: announcementValue })
    }
    onModalClose()
  }

  // Popper
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handlePoperClick = (
    event: React.MouseEvent<HTMLElement>,
    id: string,
  ) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
    setCurId(id)
  }
  const onPopperClose = () => {
    setAnchorEl(null)
    setCurId('')
  }
  const onDeleteARow = () => {
    deleteAnnouncement({ id: curId })
    onPopperClose()
  }

  const columns: MUIDataTableColumn[] = [
    { name: '_id', label: 'Id' },
    { name: 'announcement', label: 'Announcement' },
    {
      name: 'createdAt',
      label: 'CreatedAt',
      options: {
        customBodyRender: value => <span>{formatISODate(value)}</span>,
      },
    },
    {
      name: 'updatedAt',
      label: 'UpdatedAt',
      options: {
        customBodyRender: value => <span>{formatISODate(value)}</span>,
      },
    },
    {
      name: 'action',
      label: 'Action',

      options: {
        filter: false,
        customBodyRender(value, tableMeta) {
          return (
            <>
              <FormControl>
                <Edit
                  style={{ marginRight: '10px' }}
                  onClick={() => onModalOpen(tableMeta.rowData[0])}
                />
              </FormControl>
              <FormControl>
                <DeleteOutline
                  onClick={(e: any) =>
                    handlePoperClick(e, tableMeta.rowData[0])
                  }
                />
              </FormControl>
            </>
          )
        },
      },
    },
  ]

  const options: MUIDataTableOptions = {
    filterType: 'textField',
    responsive: 'stacked',
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 50],
    // @ts-ignore
    searchPlaceholder: 'Search...',
    customToolbar: () => (
      <Fab size='medium' className={styles.addIconFab}>
        <AddBox className={styles.addIcon} onClick={() => onModalOpen()} />
      </Fab>
    ),
  }

  return (
    <>
      <TableWrapper tableName='Yancey Table' icon='save'>
        <MUIDataTable
          title=''
          data={announcements}
          columns={columns}
          options={options}
        />
        {isFetching && <Loading />}
      </TableWrapper>

      <Dialog
        open={open}
        onClose={onModalClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          {!curId ? 'Add' : 'Update'} Announcement
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Announcement'
            type='text'
            fullWidth
            value={announcementValue}
            onChange={handleAnnouncementChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onModalClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={onModalSubmit} color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Popper open={!!anchorEl} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <DialogTitle id='form-dialog-title'>
                Delete the announcement(s)?
              </DialogTitle>
              <DialogActions>
                <Button onClick={onPopperClose} color='primary'>
                  Cancel
                </Button>
                <Button onClick={onDeleteARow} color='primary'>
                  OK
                </Button>
              </DialogActions>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Announcement)
