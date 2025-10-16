import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import userReducer from "../features/userSlice";
import teacherReducer from "../features/teacherSlice";
import workHourReducer from "../features/workHourSlice";
import claimReducer from "../features/claimSlice";
import reportReducer from "../features/reportSlice";
import settingReducer from "../features/settingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    teacher: teacherReducer,
    workHour: workHourReducer,
    claim: claimReducer,
    report: reportReducer,
    setting: settingReducer,
  },
});