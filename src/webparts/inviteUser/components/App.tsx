import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { Button, withStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import { DataGrid } from "./DataGrid";
import Modal from "@material-ui/core/Modal";
import RefreshIcon from "@material-ui/icons/Refresh";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import classes from "./App.module.scss";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import CommonService from "../services/CommonService";
import { IInviteUserProps } from "./IInviteUserProps";

import { CustomAlert } from "./CustomAlert";

const UserInviteBG = require("../../../ExternalRef/IMG/NewUserBG.png");

// Styles
const theme = createTheme({
  palette: {
    primary: {
      main: "#00589A",
    },
  },
});
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "0px solid #000",
    width: "600px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    // width:'500px'
  },
}));
const CheckboxStyle = withStyles({
  root: {
    color: "rgba(0, 0, 0, 0.54) ",
    "&$checked": {
      color: "rgb(253, 204, 67)",
      position: "relative",
      zIndex: 2,
      "&:after": {
        content: '""',
        left: 13,
        top: 13,
        height: 15,
        width: 15,
        position: "absolute",
        backgroundColor: "rgb(0,88,154) !important",
        zIndex: -1,
      },
    },
  },
  checked: {},
})(Checkbox);

// Styles
export const App: React.FunctionComponent<IInviteUserProps> = (
  props: IInviteUserProps
) => {
  const [viewMode, setViewMode] = useState(false);

  let _commonService: CommonService = new CommonService();

  const _companyRegistration: string = "Company Registration";
  const _userDetails: string = "User Details";

   ////Test
//    const _acceptInviteUrl: string =
//    "http://localhost:51130/Phazemos/Index?id=";

//  const clientDetailsURL =
//    "https://phazemos.sharepoint.com/sites/Douglas/SitePages/Client.aspx";


  ////Dev
  //const _acceptInviteUrl: string = "https://douglas-phazemos-new.azurewebsites.net/Phazemos/Index?id=";

  ////Dev
  //const clientDetailsURL =    "https://chandrudemo.sharepoint.com/sites/Douglas/SitePages/client1.aspx";

  // ////Prod
  const _acceptInviteUrl: string =
    "https://clientdossier.azurewebsites.net/Phazemos/Index?id=";

  ////Prod
  const clientDetailsURL =
    "https://phazemos.sharepoint.com/sites/Douglas/SitePages/Client.aspx";
    

  const [formData, setFormData] = useState({
    ID: 0,
    companyName: "",
    CompanyProfile: true,
    TherapeuticExpertise: true,
    RegulatoryExpertise: true,
    Geography: true,
    ProjectWork: true,
    PrimaryServicesOffered: true,
    Uploads: true,
    ExpertisePlatform: true,
    bioMarkerQuals: true,
    InHouseTools: true,
    PMExperience: true,
    SiteNetwork: true,
    users: [""],
  });

  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });

  function addUser() {
    let data = formData;
    data.users.push("");
    setFormData({ ...data });
  }

  function removeUser(index: number) {
    let data = formData;
    data.users.splice(index, 1);
    setFormData({ ...data });
  }

  function inviteNewUser() {
    _commonService = new CommonService();
    if (formData.ID == 0) {
      if (!formData.companyName) {
        setAlert({
          open: true,
          severity: "warning",
          message: "Company name is mandatory",
        });
        return;
      }

      for (let index = 0; index < formData.users.length; index++) {
        const user = formData.users[index];
        if (!_commonService.validateEmail(user)) {
          setAlert({
            open: true,
            severity: "warning",
            message: "Email ID is not a valid",
          });
          return;
        }
      }

      isEmailIDAlreadyExist();
    } else {
      edit();
    }
  }

  function isEmailIDAlreadyExist() {
    let customProperty = {
      listName: _userDetails,
      filter: "UserEmailID eq '" + formData.users[0] + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res.length) {
        setAlert({
          open: true,
          severity: "warning",
          message: "EmailID already registered",
        });
      } else {
        registerNewCompany();
      }
    });
  }

  function registerNewCompany() {
    let data = formData;
    let companyData = {
      Title: data.companyName,
      CompanyID: "",
      CompanyProfile: data.CompanyProfile,
      TherapeuticExpertise: data.TherapeuticExpertise,
      RegulatoryExpertise: data.RegulatoryExpertise,
      Geography: data.Geography,
      ProjectWork: data.ProjectWork,
      PrimaryServicesOffered: data.PrimaryServicesOffered,
      ExpertisePlatform: data.ExpertisePlatform,
      Uploads: data.Uploads,
      bioMarkerQuals: data.bioMarkerQuals,
      InHouseTools: data.InHouseTools,
      PMExperience: data.PMExperience,
      SiteNetwork: data.SiteNetwork,
    };

    let customProperty = {
      listName: _companyRegistration,
      ID: 0,
    };

    _commonService.insertIntoList(
      customProperty,
      companyData,
      (companyres: any) => {
        customProperty.ID = companyres.data.Id;
        companyData.CompanyID = generateCompanyID(companyres.data.Id);
        _commonService.updateList(customProperty, companyData);

        customProperty.listName = _userDetails;

        let users = data.users.slice();
        for (let index = 0; index < users.length; index++) {
          let userData = {
            UserEmailID: users[index],
            CompanyIDId: companyres.data.Id,
          };
          _commonService.insertIntoList(
            customProperty,
            userData,
            (userres: any) => {
              let graphProperty = {
                UserEmailID: users[index],
                InviteRedirectUrl:
                  _acceptInviteUrl +
                  btoa(userres.data.Id + "-" + companyData.Title),
              };

              setRender(!render);

              _commonService.graphCallToInviteUser(
                props,
                graphProperty,
                (graphres: any) => {}
              );
            }
          );
        }
        setAlert({
          open: true,
          severity: "success",
          message: "User invitation sent successfully",
        });
        handleClose();
        init();
      }
    );
  }

  function generateCompanyID(id: number) {
    let strId = id + "";
    let prefix = "COM";
    switch (strId.length) {
      case 1:
        return prefix + "00" + strId;
      case 2:
        return prefix + "0" + strId;
      default:
        return prefix + strId;
    }
  }

  function inputChangeHandler(event: any) {
    let data = formData;
    data[event.target.name] = event.target.value;
    setFormData({ ...data });
  }

  function userChangeHandler(event: any, index: number) {
    let data = formData;
    data.users[index] = event.target.value;
    setFormData({ ...data });
  }

  function init() {
    setViewMode(false);
    let data: any = {};
    data.ID = 0;
    data.companyName = "";
    data.users = [""];
    data.CompanyProfile = true;
    data.TherapeuticExpertise = true;
    data.RegulatoryExpertise = true;
    data.Geography = true;
    data.ProjectWork = true;
    data.PrimaryServicesOffered = true;
    data.ExpertisePlatform = true;
    data.Uploads = true;
    data.bioMarkerQuals = true;
    data.InHouseTools = true;
    data.PMExperience = true;
    data.SiteNetwork = true;
    setFormData({ ...data });
  }

  function checkboxChangeHandler(event: any) {
    let data = formData;
    formData[event.target.name] = event.target.checked;
    setFormData({ ...data });
  }

  function editRecord(company: any) {
    _commonService = new CommonService();
    let customProperty = {
      listName: _userDetails,
      properties: "*",
      filter: "CompanyIDId eq '" + company.CompanyIDId + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      customProperty = {
        listName: _companyRegistration,
        properties: "*",
        filter: "ID eq '" + company.CompanyIDId + "'",
      };
      _commonService.getList(customProperty, (comres: any) => {
        res.map((u) => {
          localStorage.setItem("_UserEmail_", u.UserEmailID);
        });
        window.open(clientDetailsURL, "_blank");

        // setViewMode(true);

        // let data: any = {};
        // data.ID = company.ID;
        // data.companyName = company.CompanyID.Title;
        // data.CompanyProfile = comres[0].CompanyProfile;
        // data.TherapeuticExpertise = comres[0].TherapeuticExpertise;
        // data.RegulatoryExpertise = comres[0].RegulatoryExpertise;
        // data.Geography = comres[0].Geography;
        // data.ProjectWork = comres[0].ProjectWork;
        // data.PrimaryServicesOffered = comres[0].PrimaryServicesOffered;
        // data.Uploads = comres[0].Uploads;
        // data.users = res.map((u) => {
        //   return u.UserEmailID;
        // });
        // setFormData({ ...data });
        // setOpen(true);
      });
    });
  }

  function edit() {
    let customProperty = {
      listName: _companyRegistration,
      ID: formData.ID,
    };

    let data: any = {};
    data.CompanyProfile = formData.CompanyProfile;
    data.TherapeuticExpertise = formData.TherapeuticExpertise;
    data.RegulatoryExpertise = formData.RegulatoryExpertise;
    data.Geography = formData.Geography;
    data.ProjectWork = formData.ProjectWork;
    data.PrimaryServicesOffered = formData.PrimaryServicesOffered;
    data.ExpertisePlatform = formData.ExpertisePlatform;
    data.Uploads = formData.Uploads;
    data.bioMarkerQuals = formData.bioMarkerQuals;
    data.InHouseTools = formData.InHouseTools;
    data.PMExperience = formData.PMExperience;
    data.SiteNetwork = formData.SiteNetwork;

    _commonService.updateList(customProperty, data, (companyres: any) => {
      setAlert({
        open: true,
        severity: "success",
        message: "Updated successfully",
      });
      setRender(!render);
      setOpen(false);
    });
  }

  useEffect((): any => {
    _commonService = new CommonService();
  }, []);

  const styles = useStyles();
  const [open, setOpen] = React.useState(false);
  const [render, setRender] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    init();
    setOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.App}>
        {/* Illus Section */}
        {/* <img src={`${UserInviteBG}`} /> */}
        {/* Illus Section */}
        {/* App Section */}
        <div className={classes.AppSection}>
          <div className={classes.headerSection}>
            <Typography
              variant="h5"
              color="primary"
              style={{ fontSize: "1.25rem", fontWeight: 600 }}
            >
              Invite User
            </Typography>
            <div className={classes.headerBtn}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpen}
                style={{
                  backgroundColor: "rgb(253, 204, 67)",
                  color: "rgb(0,88,154) ",
                  fontWeight: 700,
                }}
              >
                New
              </Button>
              <RefreshIcon
                style={{
                  fontSize: 28,
                  color: "#00589A",
                  margin: "0 0 0 5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setRender(!render);
                }}
              />
            </div>
          </div>
          <DataGrid render={render} EditRecord={editRecord} />
        </div>
        {/* App Section */}
      </div>
      {/* Modal Section */}
      {open && (
        <Modal open={open} onClose={handleClose} className={styles.modal}>
          <Fade in={open}>
            <div className={styles.paper}>
              <div className={classes.modalHeader}>
                <Typography
                  variant="h6"
                  color="primary"
                  style={{ fontSize: "1.25rem", fontWeight: 600 }}
                >
                  {viewMode ? "User Details" : "New User"}
                </Typography>
                <ClearIcon
                  onClick={handleClose}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <TextField
                  required
                  size="small"
                  className={classes.modalTextbox}
                  id="outlined-basic"
                  label="Company Name"
                  variant="outlined"
                  name="companyName"
                  value={formData.companyName}
                  onChange={(e) => inputChangeHandler(e)}
                  disabled={viewMode}
                />
                {formData.users.map((user: any, index: number) => {
                  return (
                    <TextField
                      required
                      size="small"
                      className={classes.modalTextbox}
                      id="outlined-basic"
                      label="Email ID"
                      variant="outlined"
                      name="user"
                      value={user}
                      onChange={(e) => userChangeHandler(e, index)}
                      disabled={viewMode}
                    />
                  );
                })}
              </div>

              {formData.users.map((user: any, index: number) => {
                return (
                  <div className={classes.EmailEntries}>
                    {/* <TextField
                      size="small"
                      className={classes.modalTextbox}
                      id="outlined-basic"
                      label="Email ID"
                      variant="outlined"
                      name="user"
                      value={user}
                      onChange={(e) => userChangeHandler(e, index)}
                    /> */}
                    {/* {formData.users.length == index + 1 && (
                      <AddIcon
                        style={{
                          cursor: "pointer",
                          fontSize: 32,
                          color: theme.palette.success.main,
                        }}
                        onClick={(e) => addUser()}
                      />
                    )} */}

                    {/* {formData.users.length > 1 && (
                      <ClearIcon
                        style={{
                          cursor: "pointer",
                          fontSize: 32,
                          color: theme.palette.error.main,
                        }}
                        onClick={(e) => removeUser(index)}
                      />
                    )} */}
                  </div>
                );
              })}

              <div className={classes.AreaExperience}>
                <p>List of Modules</p>
                <div className={classes.CheckBoxSection}>
                  <div className={classes.CheckBox}>
                    <FormControlLabel
                      control={
                        <CheckboxStyle
                          checked={formData.CompanyProfile}
                          name="CompanyProfile"
                          color="primary"
                          onChange={(e) => checkboxChangeHandler(e)}
                          disabled={viewMode}
                        />
                      }
                      label="Company Profile"
                    />
                  </div>

                  <div className={classes.CheckBox}>
                    <FormControlLabel
                      control={
                        <CheckboxStyle
                          checked={formData.TherapeuticExpertise}
                          name="TherapeuticExpertise"
                          color="primary"
                          onChange={(e) => checkboxChangeHandler(e)}
                          disabled={viewMode}
                        />
                      }
                      label="Expertise - Therapeutic"
                    />
                  </div>

                  <div className={classes.CheckBox}>
                    <FormControlLabel
                      control={
                        <CheckboxStyle
                          checked={formData.RegulatoryExpertise}
                          name="RegulatoryExpertise"
                          color="primary"
                          onChange={(e) => checkboxChangeHandler(e)}
                          disabled={viewMode}
                        />
                      }
                      label="Expertise - Regulatory"
                    />
                  </div>

                  <div className={classes.CheckBox}>
                    <FormControlLabel
                      control={
                        <CheckboxStyle
                          checked={formData.ExpertisePlatform}
                          name="ExpertisePlatform"
                          color="primary"
                          onChange={(e) => checkboxChangeHandler(e)}
                          disabled={viewMode}
                        />
                      }
                      label="Expertise - Platform"
                    />
                  </div>

                  <div className={classes.CheckBox}>
                    <FormControlLabel
                      control={
                        <CheckboxStyle
                          checked={formData.Geography}
                          name="Geography"
                          color="primary"
                          onChange={(e) => checkboxChangeHandler(e)}
                          disabled={viewMode}
                        />
                      }
                      label="Geography"
                    />
                  </div>

                  <div className={classes.CheckBox}>
                    <FormControlLabel
                      control={
                        <CheckboxStyle
                          checked={formData.ProjectWork}
                          name="ProjectWork"
                          color="primary"
                          onChange={(e) => checkboxChangeHandler(e)}
                          disabled={viewMode}
                        />
                      }
                      label="Project Work"
                    />
                  </div>

                  {/* <div className={classes.CheckBox}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.PrimaryServicesOffered}
                          name="PrimaryServicesOffered"
                          color="primary"
                          onChange={(e) => checkboxChangeHandler(e)}
                          disabled={viewMode}
                        />
                      }
                      label="Primary Services Offered"
                    />
                  </div> */}

                  <div className={classes.CheckBox}>
                    <FormControlLabel
                      control={
                        <CheckboxStyle
                          checked={formData.Uploads}
                          name="Uploads"
                          color="primary"
                          onChange={(e) => checkboxChangeHandler(e)}
                          disabled={viewMode}
                        />
                      }
                      label="Uploads"
                    />
                  </div>
                  <div className={classes.CheckBox}>
                    <FormControlLabel
                      control={
                        <CheckboxStyle
                          checked={formData.bioMarkerQuals}
                          name="bioMarkerQuals"
                          color="primary"
                          onChange={(e) => checkboxChangeHandler(e)}
                          disabled={viewMode}
                        />
                      }
                      label="Bio Marker Quals"
                    />
                  </div>
                  <div className={classes.CheckBox}>
                    <FormControlLabel
                      control={
                        <CheckboxStyle
                          checked={formData.InHouseTools}
                          name="InHouseTools"
                          color="primary"
                          onChange={(e) => checkboxChangeHandler(e)}
                          disabled={viewMode}
                        />
                      }
                      label="In House Tools"
                    />
                  </div>
                  <div className={classes.CheckBox}>
                    <FormControlLabel
                      control={
                        <CheckboxStyle
                          checked={formData.PMExperience}
                          name="PMExperience"
                          color="primary"
                          onChange={(e) => checkboxChangeHandler(e)}
                          disabled={viewMode}
                        />
                      }
                      label="PM Experience"
                    />
                  </div>
                  <div className={classes.CheckBox}>
                    <FormControlLabel
                      control={
                        <CheckboxStyle
                          checked={formData.SiteNetwork}
                          name="SiteNetwork"
                          color="primary"
                          onChange={(e) => checkboxChangeHandler(e)}
                          disabled={viewMode}
                        />
                      }
                      label="Site Network"
                    />
                  </div>
                </div>
              </div>

              {!viewMode && (
                <div className={classes.btnSubmit}>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "rgb(253, 204, 67)",
                      color: "rgb(0,88,154) ",
                      fontWeight: 700,
                    }}
                    onClick={(e) => inviteNewUser()}
                  >
                    Submit
                  </Button>
                </div>
              )}
            </div>
          </Fade>
        </Modal>
      )}

      <CustomAlert
        open={cusalert.open}
        message={cusalert.message}
        severity={cusalert.severity}
        handleClose={(e) => {
          setAlert({
            open: false,
            severity: "",
            message: "",
          });
        }}
      ></CustomAlert>
    </ThemeProvider>
  );
};
