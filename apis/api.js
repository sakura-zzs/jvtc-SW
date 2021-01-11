const baseUrl = process.env.NODE_ENV == 'development' ? "http://xz.jvtc.jx.cn/JVTC_XG/" : "http://jvtc.cdn.notbucai.com/JVTC_XG/";

const login = baseUrl + "UserLogin.aspx";
const simpleLogin = baseUrl + "WebSite/ClassManageWeb/index.html";
const init = baseUrl + "UserLogin.html";
const img_code = baseUrl + "default3.html";
const userinfo = baseUrl + "SystemForm/Class/MyStudent.aspx";
const StuActive = baseUrl + "SystemForm/StuActive/MyAction.aspx";
const AppAction = baseUrl + "SystemForm/StuActive/AppAction.aspx?Id=";
const WorkInfo = baseUrl + "SystemForm/WorkInfo.aspx";
const MyActionGetNum = baseUrl + "SystemForm/StuActive/MyActionGetNum.aspx";
const StuEnlightenRoomScore = baseUrl + "SystemForm/Gardens/StuEnlightenRoomScore.aspx";
const StuJudgeScore = baseUrl + "SystemForm/StudentJudge/StuJudgeScore.aspx";
const StuAllLeaveManage_Edit = baseUrl + "SystemForm/Leave/StuAllLeaveManage_Edit.aspx?Status=";
const StuAllLeaveManage = baseUrl + "/SystemForm/Leave/StuAllLeaveManage.aspx";

// 老师相关
const TeacherInfo = baseUrl + "SystemForm/Personal/MyPerson.aspx";
const Navigation = baseUrl + "SystemForm/Navigation.aspx";
const TeacherReSetpass = baseUrl + "SystemForm/Class/TeacherReSetpass.aspx";
const FDYAllLeaveExam = baseUrl + "SystemForm/Leave/FDYAllLeaveExam.aspx";
const FDYAllLeaveExam_Edit = baseUrl + "SystemForm/Leave/FDYAllLeaveExam_Edit.aspx?Id="
const FDYLeaveExam = baseUrl + "SystemForm/Leave/FDYLeaveExam.aspx";
const FDYDisAllLeave = baseUrl + "SystemForm/Leave/FDYDisAllLeave.aspx";
const FDYDisLeave = baseUrl + "SystemForm/Leave/FDYDisLeave.aspx";
const TeacherChangePass = baseUrl + 'SystemForm/Personal/ChangePass.aspx';

// 校园卡
const ICBCINBSEstablishSessionServlet = 'https://fee.icbc.com.cn/servlet/ICBCINBSEstablishSessionServlet';

module.exports = {
  login,
  simpleLogin,
  init,
  userinfo,
  StuActive,
  AppAction,
  WorkInfo,
  MyActionGetNum,
  StuEnlightenRoomScore,
  img_code,
  Navigation,
  StuJudgeScore,
  StuAllLeaveManage_Edit,
  StuAllLeaveManage,
  // 老师相关
  TeacherInfo,
  TeacherReSetpass,
  FDYAllLeaveExam,
  FDYAllLeaveExam_Edit,
  FDYLeaveExam,
  FDYDisAllLeave,
  FDYDisLeave,
  TeacherChangePass,
}