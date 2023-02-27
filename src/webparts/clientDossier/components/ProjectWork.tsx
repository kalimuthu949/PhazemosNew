import * as React from "react";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Modal from "@material-ui/core/Modal";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Button } from "@material-ui/core";
import classes from "./ProjectWork.module.scss";

import CommonService from "../services/CommonService";
import CancelIcon from "@material-ui/icons/Cancel";

import { CustomAlert } from "./CustomAlert";

export interface IProjectWork {
  CompanyName: string;
  CompanyID: string;
  CompanyCode: string;
  changefunction?: any;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#00589A",
    },
  },
});
// export const ProjectWork: React.FunctionComponent<IProjectWork> = (
//   props: IProjectWork
// ) => {
const ProjectWork = forwardRef((props: IProjectWork, ref) => {
  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });

  const [projectWorkID, setProjectWorkID] = useState(0);
  const [allCategories, setAllCategories] = useState([]);
  // const [allTicketSizes, setAllTicketSizes] = useState([]);

  const [keyCompanies, setKeyCompanies] = useState([]);
  const [deleteKeyCompanies, setDeleteKeyCompanies] = useState([]);

  const [readOnly, setReadOnly] = useState(false);

  var _commonService: CommonService;

  const _project: string = "Project";
  const _projectWorkCompanyDetails: string = "Project Work Company Details";
  const _projectWorkMapping: string = "Project Work Mapping";
  const _projectWorkMaster: string = "Project Work Master";
  const _projectWorkCategoryMaster: string = "Project Work Category Master";

  // function loadCompanyProjectWorkMaster(editData: any) {
  //   let customProperty = {
  //     listName: _projectWorkMaster,
  //     properties: "ID,Title,IsActive",
  //     orderby: "OrderNo",
  //     orderbyAsc: true,
  //   };
  //   _commonService.getList(customProperty, (res: any) => {
  //     let ticketSizes = [];
  //     for (let index = 0; index < res.length; index++) {
  //       let editMap = editData.projectWorkMapping.filter(
  //         (c) => c.ProjectWorkMasterIDId == res[index].Id
  //       );
  //       if (editMap.length || res[index].IsActive) {
  //         let data = {
  //           ID: 0,
  //           ProjectIDId: 0,
  //           ProjectWorkMasterIDId: res[index].Id,
  //           Title: res[index].Title,
  //           Year: "",
  //           Size: "",
  //         };
  //         if (editMap.length) {
  //           data.ProjectIDId = editMap[0].ProjectIDId;
  //           data.ID = editMap[0].ID;
  //           data.Year = editMap[0].Year;
  //           data.Size = editMap[0].Size;
  //         }
  //         ticketSizes.push(data);
  //       }
  //     }
  //     setAllTicketSizes([...ticketSizes]);
  //   });
  // }

  const [open, setOpen] = useState(true);
  const [isPageChanged, setIsPageChanged] = useState(false);
  function pageAlert() {
    setIsPageChanged(true);
    setOpen(true);
  }

  useImperativeHandle(ref, () => {
    return { pageAlert: pageAlert };
  });

  function successAfterPageSave() {
    props.changefunction(false);
    setOpen(false);
    setIsPageChanged(false);
  }

  function loadCompanyProjectWork(editData: any) {
    let customProperty = {
      listName: _projectWorkCompanyDetails,
      filter: "ProjectIDId eq '" + editData.ID + "'  and IsDeleted eq 0",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res && res.length > 0) {
        let keyCompany: any = [];
        for (let index = 0; index < res.length; index++) {
          keyCompany.push({
            ProjectIDId: res[index].ProjectIDId,
            CategoryIDId: res[index].CategoryIDId,
            ID: res[index].ID,
            Description: res[index].Description,
            IsDeleted: res[index].IsDeleted,
          });
        }
        setKeyCompanies([...keyCompany]);
        loadCategoryMaster(keyCompany);
      } else {
        let keyCompany = [
          {
            ProjectIDId: 0,
            CategoryIDId: 1,
            ID: 0,
            Description: "",
            IsDeleted: false,
          },
        ];
        setKeyCompanies([...keyCompany]);
        loadCategoryMaster(keyCompany);
      }
    });
  }

  // function loadCompanyProjectWorkMapping(projectWorkId: number) {
  //   let customProperty = {
  //     listName: _projectWorkMapping,
  //     filter: "ProjectIDId eq '" + projectWorkId + "'",
  //   };
  //   _commonService.getList(customProperty, (res: any) => {
  //     if (res && res.length > 0) {
  //       loadCompanyProjectWorkMaster({
  //         projectWorkMapping: res,
  //       });
  //     } else {
  //       loadCompanyProjectWorkMaster({
  //         projectWorkMapping: [],
  //       });
  //     }
  //   });
  // }

  function loadCategoryMaster(keyCompanies: any) {
    let customProperty = {
      listName: _projectWorkCategoryMaster,
      properties: "ID,Title,IsActive",
      orderby: "OrderNo",
      orderbyAsc: true,
    };
    _commonService.getList(customProperty, (res: any) => {
      let categories = [];
      for (let index = 0; index < res.length; index++) {
        let editMap = keyCompanies.filter(
          (c) => c.CategoryIDId == res[index].Id
        );
        if (editMap.length || res[index].IsActive) {
          let data = {
            ID: res[index].ID,
            Title: res[index].Title,
          };
          categories.push(data);
        }
      }
      categories = sortData(categories);
      setAllCategories([...categories]);
    });
  }
  function sortData(Data) {
    Data.sort((a, b) => (a.Title > b.Title ? 1 : b.Title > a.Title ? -1 : 0));
    return Data;
  }
  function loadCompanyData() {
    let customProperty = {
      listName: _project,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res && res.length > 0) {
        setProjectWorkID(res[0].ID);
        loadCompanyProjectWork(res[0]);
        // loadCompanyProjectWorkMapping(res[0].ID);
      } else {
        setProjectWorkID(0);
        addKeyCompanies();
        // loadCompanyProjectWorkMaster({
        //   projectWorkMapping: [],
        // });
        loadCategoryMaster([]);
      }
    });
  }

  function init() {
    if (localStorage.getItem("_IsReadOnly_")) {
      setReadOnly(true);
    } else {
      setReadOnly(false);
    }

    setDeleteKeyCompanies([]);
    _commonService = new CommonService();
    loadCompanyData();
  }

  function addKeyCompanies() {
    let keyCompany = keyCompanies;
    keyCompany.push({
      IsDeleted: false,
      ProjectIDId: 0,
      CategoryIDId: 1,
      ID: 0,
      Description: "",
    });
    setKeyCompanies([...keyCompany]);
  }

  function removeKeyCompanies(index) {
    let allKeyCompanies = keyCompanies;
    let delData = deleteKeyCompanies;
    if (allKeyCompanies[index].ID != 0) {
      allKeyCompanies[index].IsDeleted = true;
      delData.push(allKeyCompanies[index]);
    }
    allKeyCompanies.splice(index, 1);
    setKeyCompanies([...allKeyCompanies]);
    setDeleteKeyCompanies([...delData]);
  }

  function selHandleChange(event: any, index: number) {
    let allKeyCompanies = keyCompanies;
    allKeyCompanies[index].CategoryIDId = event.target.value;
    setKeyCompanies([...allKeyCompanies]);
    props.changefunction(true);
  }

  function inputChangeHandler(event: any, index: number): any {
    let allKeyCompanies = keyCompanies;
    allKeyCompanies[index][event.target.name] = event.target.value;
    setKeyCompanies([...allKeyCompanies]);
    props.changefunction(true);
  }

  function submitData() {
    let formKeys = Object.keys(keyCompanies[0]);
    let isValidForm = true;

    for (let index = 0; index < keyCompanies.length; index++) {
      for (let j = 0; j < formKeys.length; j++) {
        if (
          formKeys[j] != "ID" &&
          formKeys[j] != "IsDeleted" &&
          formKeys[j] != "ProjectIDId" &&
          !keyCompanies[index][formKeys[j]]
        ) {
          // console.log(formKeys[j] + " is required");
          isValidForm = false;
          break;
        }
      }
    }
    if (!isValidForm) {
      setAlert({
        open: true,
        severity: "warning",
        message: "Invalid form",
      });
      return;
    }

    _commonService = new CommonService();

    if (projectWorkID == 0) {
      _commonService.insertIntoList(
        {
          listName: _project,
        },
        { CompanyIDId: props.CompanyID },
        (res: any) => {
          insertOrUpdateKeyCompany(res.data.Id);
          // insertOrUpdateProjectWorkMapping(res.data.Id);
        }
      );
      setAlert({
        open: true,
        severity: "success",
        message: "Inserted successfully",
      });
    } else {
      insertOrUpdateKeyCompany(projectWorkID);
      // insertOrUpdateProjectWorkMapping(projectWorkID);
      setAlert({
        open: true,
        severity: "success",
        message: "Updated successfully",
      });
    }
  }

  function insertOrUpdateKeyCompany(projectIDId: number) {
    let locKeyCompanies = keyCompanies.slice();
    let addData = locKeyCompanies.filter((c) => c.ID == 0);
    let editData = locKeyCompanies.filter((c) => c.ID != 0);
    addData.forEach((data) => {
      data.ProjectIDId = projectIDId;
      delete data.ID;
    });

    if (addData.length) {
      _commonService.bulkInsert(
        { listName: _projectWorkCompanyDetails },
        addData,
        (res) => {
          init();
          successAfterPageSave();
        }
      );
    }

    editData = deleteKeyCompanies.concat(editData);

    if (editData.length) {
      _commonService.bulkUpdate(
        { listName: _projectWorkCompanyDetails },
        editData,
        (res) => {
          init();
          successAfterPageSave();
        }
      );
    }
  }

  // function insertOrUpdateProjectWorkMapping(projectIDId: number) {
  // let locTicketSizes = allTicketSizes.slice();
  // let addData = locTicketSizes.filter((c) => c.ID == 0);
  // let editData = locTicketSizes.filter((c) => c.ID != 0);
  // addData.forEach((data) => {
  //   data.ProjectIDId = projectIDId;
  //   delete data.ID;
  //   delete data.Title;
  // });

  // editData.forEach((data) => {
  //   delete data.Title;
  // });

  // if (addData.length) {
  //   _commonService.bulkInsert(
  //     { listName: _projectWorkMapping },
  //     addData,
  //     (res) => {
  //       init();
  //     }
  //   );
  // }

  // if (editData.length) {
  //   _commonService.bulkUpdate(
  //     { listName: _projectWorkMapping },
  //     editData,
  //     (res) => {
  //       init();
  //     }
  //   );
  // }
  // }

  useEffect((): any => {
    init();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {" "}
      {/* <h3 className={classes.headerTitle}>Company Profile</h3> */}
      {isPageChanged ? (
        <Modal open={open}>
          <div className={classes.modalContainer}>
            <div className={classes.modalSize}>
              <div className={classes.header}>
                <h3
                  style={{
                    margin: "0px 5px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  Alert
                </h3>
              </div>
              <div className={classes.section}>
                <span>
                  Please click submit before moving to another tab or your work
                  will be lost
                </span>
              </div>
              <div className={classes.popupBtn}>
                <Button
                  style={{
                    backgroundColor: "rgb(0,88,154)",
                    color: "rgb(253, 204, 67)",
                  }}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  No
                </Button>
                <Button
                  style={{
                    backgroundColor: "rgb(253, 204, 67)",
                    color: "rgb(0,88,154) ",
                  }}
                  onClick={() => {
                    successAfterPageSave();
                  }}
                >
                  Yes
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        ""
      )}
      <div className={`${classes.companyDetails} disableInput`}>
        <TextField
          style={{ width: "38%", marginRight: 32 }}
          id="outlined-basic"
          label="Company Name"
          size="small"
          variant="outlined"
          aria-readonly={true}
          name="CompanyName"
          value={props.CompanyName}
          disabled
        />
        <TextField
          id="outlined-basic"
          size="small"
          label="ID"
          variant="outlined"
          className={classes.idTextField}
          aria-readonly={true}
          value={props.CompanyCode}
          disabled
        />
      </div>
      <h4 className={classes.headerTitle}>
        List and describe up to five (5) Key Company Differentiators (things
        that your team does often and well)
      </h4>
      {keyCompanies.map((company: any, index: number) => {
        return (
          <div className={classes.CategorySection}>
            <div>
              <FormControl
                variant="outlined"
                style={{ width: "30%", margin: "8px 8px 8px 0" }}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Category
                </InputLabel>
                <Select
                  disabled={readOnly}
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  label="Category"
                  value={company.CategoryIDId}
                  onChange={(e) => selHandleChange(e, index)}
                >
                  {allCategories.map((m) => {
                    return <MenuItem value={m.ID}>{m.Title}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </div>

            <TextField
              required
              id="outlined-basic"
              size="small"
              label="Description"
              variant="outlined"
              multiline
              className={classes.multiText}
              value={company.Description}
              name="Description"
              onChange={(e) => inputChangeHandler(e, index)}
              disabled={readOnly}
            />
            {keyCompanies.length == index + 1 && !readOnly && (
              <AddCircleIcon
                onClick={(e) => addKeyCompanies()}
                style={{
                  fontSize: 34,
                  color: theme.palette.primary.main,
                  marginLeft: 8,
                  cursor: "pointer",
                }}
              />
            )}

            {keyCompanies.length > 1 && !readOnly && (
              <CancelIcon
                style={{
                  cursor: "pointer",
                  fontSize: 34,
                  margin: "0px 8px",
                  color: theme.palette.error.main,
                }}
                onClick={(e) => removeKeyCompanies(index)}
              />
            )}
          </div>
        );
      })}
      {!readOnly && (
        <div className={classes.bottomBtnSection}>
          <Button
            variant="contained"
            style={{
              backgroundColor: "rgb(253, 204, 67)",
              color: "rgb(0,88,154) ",
            }}
            size="large"
            onClick={(e) => submitData()}
          >
            Submit
          </Button>
        </div>
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
});
export default ProjectWork;
