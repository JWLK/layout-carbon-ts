import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link, NavLinkProps, NavLink, Routes, Route, Navigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import gravatar from 'gravatar'
import loadable from '@loadable/component'
//Components
import SideMenuRight from '@components/Home/SideMenuRight'
//Pages
const CreateWorkspace = loadable(() => import('@pages/Home/CreateWorkspace'))
const ManageWorkspace = loadable(() => import('@pages/Home/ManageWorkspace'))

//Hooks & Util & Type
import useInput from '@hooks/useInput'
import { useViewport } from '@hooks/useViewport'
import fetcher from '@utils/fetcher'
import { IChannel, IUser } from '@typings/db'
//Request
import axios from 'axios'
import useSWR from 'swr'

//Css
import { Logo, Wrapper, Contents } from './styles'
//Carbon
import { Fade20, Carbon24, NewTab16, Search20, Notification20, User20 } from '@carbon/icons-react'
import {
    Header,
    HeaderGlobalAction,
    HeaderGlobalBar,
    HeaderNavigation,
    HeaderMenu,
    HeaderMenuItem,
} from 'carbon-components-react'

const Home = () => {
    /*Size Check*/
    const { width } = useViewport()

    /* Parameter */
    const { workspace } = useParams<{ workspace?: string }>()

    /* SWR */
    const { data: userData, mutate: revalidateUser } = useSWR<IUser | false>('/api/users', fetcher)

    /* State */
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('')
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('')

    /* Event Ui */
    /*SideMenu-Right : Profile*/
    const [showUserMenu, setShowUserMenu] = useState(false)
    const onClickUserProfile = useCallback(() => {
        setShowUserMenu((prev) => !prev)
    }, [])

    /* Event Axios */
    const onLogOut = useCallback(() => {
        axios
            .post('/api/users/logout')
            .then(() => {
                revalidateUser()
            })
            .catch((error) => {
                console.dir(error)
                toast.error(error.response?.data, { position: 'bottom-center' })
            })
    }, [revalidateUser])

    const onCreateWorkspace = useCallback(
        (e) => {
            e.preventDefault()
            if (!newWorkspace || !newWorkspace.trim()) {
                return
            }
            if (!newUrl || !newUrl.trim()) {
                return
            }
            axios
                .post('/api/workspaces', {
                    workspace: newWorkspace,
                    url: newUrl,
                })
                .then(() => {
                    revalidateUser()
                    // setShowCreateWorkspaceModal(false)
                    setNewWorkspace('')
                    setNewUrl('')
                })
                .catch((error) => {
                    console.dir(error)
                    toast.error(error.response?.data, { position: 'bottom-center' })
                })
        },
        [newWorkspace, newUrl, revalidateUser, setNewWorkspace, setNewUrl],
    )

    return (
        <>
            <Header aria-label="CARBON Platform Namerud" style={{ background: 'transparent' }}>
                <HeaderGlobalAction
                    aria-label="Home"
                    tooltipAlignment="start"
                    onClick={() => {
                        window.location.reload()
                    }}
                >
                    <Carbon24 />
                </HeaderGlobalAction>
                <Logo>
                    <Link to={`/home`}>CARBON[Platform]</Link>
                </Logo>
                <HeaderNavigation aria-label="Workspace">
                    <HeaderMenuItem<NavLinkProps> element={NavLink} to="/home" target="_blank">
                        HOME
                    </HeaderMenuItem>

                    <HeaderMenu aria-label="Link 4" menuLinkName="Link 4">
                        <HeaderMenuItem href="#">Sub-link 1</HeaderMenuItem>
                        <HeaderMenuItem href="#">Sub-link</HeaderMenuItem>
                        <HeaderMenuItem href="#">Sub-link 3</HeaderMenuItem>
                    </HeaderMenu>
                </HeaderNavigation>
                <HeaderGlobalBar>
                    <HeaderGlobalAction aria-label="Search" onClick={() => {}}>
                        <Search20 />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction aria-label="Notifications" onClick={() => {}}>
                        <Notification20 />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction
                        aria-label="Account"
                        onClick={onClickUserProfile}
                        tooltipAlignment="end"
                        isActive={showUserMenu}
                    >
                        <User20 />
                    </HeaderGlobalAction>
                </HeaderGlobalBar>
                <SideMenuRight show={showUserMenu} onLogOut={onLogOut} transparent={true} />
            </Header>
            <Wrapper>
                <Contents mobile={false}>
                    <Routes>
                        <Route path="/*" element={<Navigate replace to="/home/manage" />} />
                        <Route path="/create/" element={<CreateWorkspace />} />
                        <Route path="/manage/" element={<ManageWorkspace />} />
                    </Routes>
                </Contents>
            </Wrapper>
        </>
    )
}

export default Home
