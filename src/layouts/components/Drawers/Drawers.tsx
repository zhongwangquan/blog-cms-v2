// FIXME:
/* eslint-disable */

import React, { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { RootState } from 'typesafe-actions'
import Drawer from '@material-ui/core/Drawer'
import Avatar from '@material-ui/core/Avatar'
import classNames from 'classnames'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getInitials, matchPath } from 'shared/utils'
import history from 'shared/history'
import routes, { BaseRoute } from './Routes'
import styles from './Drawers.module.scss'

interface DrawersProps {
  open: boolean
}

const mapStateToProps = (state: RootState) => {
  const {
    router: {
      location: { pathname },
    },
  } = state

  return {
    pathname,
  }
}

type Props = DrawersProps & ReturnType<typeof mapStateToProps>

const Drawers: FC<Props> = ({ open, pathname }) => {
  const [drawerItem, setDrawerItem] = useState(matchPath(pathname))

  const handleDrawerChange = (route: any) => {
    route.children
      ? setDrawerItem({
          ...drawerItem,
          parent:
            route.children.length !== 0
              ? drawerItem.parent === route.path
                ? ''
                : route.path
              : route.path,
          child: route.children.length !== 0 ? drawerItem.child : '',
        })
      : setDrawerItem({ ...drawerItem, child: route.path })

    if (route.children && route.children.length === 0) {
      history.push(route.path)
    }
  }

  const setItemStyle = (children: BaseRoute[], curItem: string) => {
    if (curItem === drawerItem.parent) {
      if (children.length > 0) {
        return styles.activeDrawerItemHasChildren
      }
      return styles.activeDrawerItem
    }
  }
  return (
    <Drawer
      variant='permanent'
      classes={{
        paper: styles.drawerContainer,
      }}
    >
      <section
        className={classNames(styles.drawer, { [styles.foldDrawer]: !open })}
      >
        <div className={styles.drawerContent}>
          <div className={styles.drawerTitle}>
            <FontAwesomeIcon
              icon={['fab', 'react']}
              className={styles.drawLogo}
            />
            <span
              className={classNames(styles.drawerDetail, {
                [styles.hideDrawerDetail]: !open,
              })}
            >
              BLOG CMS
            </span>
          </div>
          <div className={classNames(styles.drawerUser)}>
            <Avatar
              alt='Yancey Official Logo'
              src='https://static.yanceyleo.com/_Users_licaifan_Desktop_11532336786_.pic_hd.jpg'
              className={styles.avater}
            />
            <div
              className={classNames(styles.drawerDetail, {
                [styles.hideDrawerDetail]: !open,
              })}
            >
              <span className={styles.drawerTxt}>Yancey Leo</span>
              <span className={styles.arrow} />
            </div>
          </div>

          {routes.map((route: any, key: number) => (
            <div className={styles.drawerList} key={route.name}>
              <div
                className={classNames(
                  styles.drawerItem,
                  setItemStyle(route.children, route.path),
                )}
                onClick={() => handleDrawerChange(route)}
              >
                <FontAwesomeIcon
                  icon={route.icon as IconProp}
                  className={styles.drawerItemIcon}
                />
                <div
                  className={classNames(styles.drawerDetail, {
                    [styles.hideDrawerDetail]: !open,
                  })}
                >
                  <span className={styles.drawerTxt}>{route.name}</span>
                  {route.children.length !== 0 ? (
                    <span
                      className={classNames(styles.arrow, {
                        [styles.reverseArrow]: drawerItem.parent === route.path,
                      })}
                    />
                  ) : null}
                </div>
              </div>
              {route.children.length !== 0 ? (
                <div
                  className={classNames(styles.itemChildren, {
                    [styles.activeItemChildren]:
                      drawerItem.parent === route.path,
                  })}
                  style={
                    drawerItem.parent === route.path
                      ? { maxHeight: `${50 * route.children.length}px` }
                      : {}
                  }
                >
                  {route.children.map((child: any) => (
                    <Link to={child.path} key={child.name}>
                      <div
                        className={classNames(
                          styles.drawerItem,
                          styles.drawerItemChildren,
                          {
                            [styles.activeDrawerItem]:
                              drawerItem.child === child.path,
                          },
                        )}
                        onClick={() => handleDrawerChange(child)}
                      >
                        <span className={styles.drawerItemIcon}>
                          {getInitials(child.name)}
                        </span>
                        <div
                          className={classNames(styles.drawerDetail, {
                            [styles.hideDrawerDetail]: !open,
                          })}
                        >
                          <span className={styles.drawerTxt}>{child.name}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </Drawer>
  )
}

export default connect(mapStateToProps)(Drawers)
