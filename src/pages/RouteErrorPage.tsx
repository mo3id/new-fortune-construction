import { useRouteError } from 'react-router-dom'
import AppErrorPage from '@/pages/AppErrorPage'

export default function RouteErrorPage() {
    return <AppErrorPage error={useRouteError()} />
}
