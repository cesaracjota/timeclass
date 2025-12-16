import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import { getTeacherDashboard } from "../../features/reportSlice";
import TeacherDashboard from "./TeacherDashboard";

const Home = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { teacherDashboard, isTeacherDashboardLoading } = useSelector((state) => state.report);
  const [openAlert, setOpenAlert] = React.useState(true);

  const closeAlert = () => {
    setOpenAlert(false);
  }

  const userData = user?.user;

  useEffect(() => {
    if ((userData?.role === "TEACHER" || userData?.role === "SUPERVISOR") && userData?.teacher?.id) {
      dispatch(getTeacherDashboard(userData?.teacher?.id));
    }
  }, [dispatch, userData?.teacher?.id, userData?.role]);

  if (userData?.role === "TEACHER" || userData?.role === "SUPERVISOR") {
    return <TeacherDashboard data={teacherDashboard} isLoading={isTeacherDashboardLoading} openAlert={openAlert} closeAlert={closeAlert} />;
  }

  if (userData?.role === "ADMIN" || userData?.role === "SUPERVISOR") {
    return <AdminDashboard />;
  }

  return (
    <div>
      <h2>Rol no autorizado o no definido</h2>
    </div>
  );
};

export default Home;
