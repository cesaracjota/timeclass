import MainLayout from '../layouts/MainLayout';
import Users from '../components/users/Users';
import { CssVarsProvider } from '@mui/joy';

const UsersPage = () => {
  return (
    // <CssVarsProvider>
      <MainLayout>
        <Users />
      </MainLayout>
    // </CssVarsProvider>
  )
}

export default UsersPage;