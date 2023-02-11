import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import { DataGrid } from "./DataGrid";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import classes from "./App.module.scss";
import Checkbox from "@material-ui/core/Checkbox";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { initial } from "lodash";
const UserInviteBG = require("../../../ExternalRef/IMG/NewUserBG.png");

import { CustomAlert } from "./CustomAlert";

import CommonService from "../services/CommonService";

export interface IApp {}

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
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export const App: React.FunctionComponent<IApp> = (props: IApp) => {
  var _commonService: CommonService;

  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });

  const styles = useStyles();
  const [open, setOpen] = useState(false);

  const [selOpen, setSelOpen] = React.useState(false);

  const [record, setRecord] = useState({
    Title: "",
    ID: 0,
    IsActive: true,
  });

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    let rec = {
      Title: "",
      ID: 0,
      IsActive: true,
    };
    setRecord({ ...rec });
    setOpen(true);
  };

  const selHandleChange = (event) => {
    setCurrentMaster(event.target.value);
  };

  const selHandleClose = () => {
    setSelOpen(false);
  };

  const selHandleOpen = () => {
    setSelOpen(true);
  };

  let initialMaster = {
    title: "Disease Area Experience Master",
    listName: "Disease Area Experience Master",
  };

  const [currentMaster, setCurrentMaster] = useState(initialMaster.title);
  const [refresh, setRefresh] = useState(true);

  const [masters, setMasters] = useState([
    initialMaster,
    {
      title: "In House Regulatory Regime Experience Master",
      listName: "In House Regulatory Regime Experience Master",
    },
    {
      title: "Primary Services Offered Master",
      listName: "Primary Services Offered Master",
    },
    {
      title: "Expertise Platform Master",
      listName: "Expertise Platform Master",
    },
    {
      title: "Therapeutic Area Experience Master",
      listName: "Therapeutic Area Experience Master",
    },
    {
      title: "Project Work Category Master",
      listName: "Project Work Category Master",
    },
    {
      title: "QB Measurable Characteristics Master",
      listName: "QB Measurable Characteristics Master",
    },
    {
      title: "QB Categories Master",
      listName: "QB Categories Master",
    },
  ]);

  function editRecord(master) {
    let rec = {
      ID: master.ID,
      Title: master.Title,
      IsActive: master.IsActive,
    };
    setRecord({ ...rec });
    setOpen(true);
  }

  function inputChangeHandler(event: any) {
    let data = record;
    data.Title = event.target.value;
    setRecord({ ...data });
  }

  function closeAddOrEdit() {
    setOpen(false);
  }

  function changeActive(event: any) {
    let locMasterData = record;
    locMasterData.IsActive = event.target.checked;
    setRecord({ ...record });
  }

  function submitData() {
    if (!record.Title) {
      setAlert({
        open: true,
        severity: "warning",
        message: "Invalid Title",
      });
      return;
    }
    _commonService = new CommonService();
    if (record.ID == 0) {
      let customProperty = {
        listName: currentMaster,
      };
      _commonService.insertIntoList(
        customProperty,
        { Title: record.Title, IsActive: true },
        (res: any) => {
          setAlert({
            open: true,
            severity: "success",
            message: "Inserted successfully",
          });
          setOpen(false);
          setRefresh(!refresh);
        }
      );
    } else {
      let customProperty = {
        listName: currentMaster,
        ID: record.ID,
      };
      _commonService.updateList(
        customProperty,
        { Title: record.Title, IsActive: record.IsActive },
        (res: any) => {
          setAlert({
            open: true,
            severity: "success",
            message: "Updated successfully",
          });
          setOpen(false);
          setRefresh(!refresh);
        }
      );
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.App}>
        <div className={classes.AppSection}>
          <div className={classes.headerSection}>
            <Typography variant="h5" color="primary" style={{ fontSize: 21 }}>
              Masters
            </Typography>

            <div>
              <div className={classes.dropdownflex}>
                <FormControl
                  style={{ width: "400px" }}
                  variant="outlined"
                  size="small"
                >
                  <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={selOpen}
                    onClose={selHandleClose}
                    onOpen={selHandleOpen}
                    value={currentMaster}
                    onChange={selHandleChange}
                  >
                    {masters.map((m) => {
                      return <MenuItem value={m.listName}>{m.title}</MenuItem>;
                    })}
                  </Select>
                </FormControl>

                <div className={classes.headerBtn}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                  >
                    New
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DataGrid
            ListName={currentMaster}
            EditRecord={editRecord}
            Refresh={refresh}
            AddOrEdit={open}
            closeAddOrEdit={closeAddOrEdit}
            record={record}
            inputChangeHandler={inputChangeHandler}
            changeActive={changeActive}
            submitData={submitData}
          />
        </div>
      </div>

      {open && (
        <Modal open={open} onClose={handleClose} className={styles.modal}>
          <Fade in={open}>
            <div className={styles.paper}>
              <div className={classes.modalHeader}>
                {" "}
                <Typography variant="h6" color="primary">
                  Master
                </Typography>
                <ClearIcon
                  onClick={handleClose}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <TextField
                size="small"
                className={classes.modalTextbox}
                id="outlined-basic"
                label="Title"
                variant="outlined"
                onChange={(e) => inputChangeHandler(e)}
                value={record.Title}
              />
              <div className={classes.btnSubmit}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => submitData()}
                >
                  Submit
                </Button>
              </div>
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
