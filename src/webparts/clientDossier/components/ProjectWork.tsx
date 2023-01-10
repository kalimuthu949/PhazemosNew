import * as React from "react";
import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Button } from "@material-ui/core";
import classes from "./ProjectWork.module.scss";

import CommonService from "../services/CommonService";
import ClearIcon from "@material-ui/icons/Clear";

import { CustomAlert } from "./CustomAlert";

export interface IProjectWork {
  CompanyName: string;
  CompanyID: string;
  CompanyCode: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#00589A",
    },
  },
});
export const ProjectWork: React.FunctionComponent<IProjectWork> = (
  props: IProjectWork
) => {
  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });

  const [projectWorkID, setProjectWorkID] = useState(0);
  const [allCategories, setAllCategories] = useState([]);
  const [allTicketSizes, setAllTicketSizes] = useState([]);

  const [keyCompanies, setKeyCompanies] = useState([]);
  const [deleteKeyCompanies, setDeleteKeyCompanies] = useState([]);

  var _commonService: CommonService;

  const _project: string = "Project";
  const _projectWorkCompanyDetails: string = "Project Work Company Details";
  const _projectWorkMapping: string = "Project Work Mapping";
  const _projectWorkMaster: string = "Project Work Master";
  const _projectWorkCategoryMaster: string = "Project Work Category Master";

  function loadCompanyProjectWorkMaster(editData: any) {
    let customProperty = {
      listName: _projectWorkMaster,
      properties: "ID,Title,IsActive",
      orderby: "OrderNo",
      orderbyAsc: true,
    };
    _commonService.getList(customProperty, (res: any) => {
      let ticketSizes = [];
      for (let index = 0; index < res.length; index++) {
        let editMap = editData.projectWorkMapping.filter(
          (c) => c.ProjectWorkMasterIDId == res[index].Id
        );
        if (editMap.length || res[index].IsActive) {
          let data = {
            ID: 0,
            ProjectIDId: 0,
            ProjectWorkMasterIDId: res[index].Id,
            Title: res[index].Title,
            Year: "",
            Size: "",
          };
          if (editMap.length) {
            data.ProjectIDId = editMap[0].ProjectIDId;
            data.ID = editMap[0].ID;
            data.Year = editMap[0].Year;
            data.Size = editMap[0].Size;
          }
          ticketSizes.push(data);
        }
      }
      setAllTicketSizes([...ticketSizes]);
    });
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

  function loadCompanyProjectWorkMapping(projectWorkId: number) {
    let customProperty = {
      listName: _projectWorkMapping,
      filter: "ProjectIDId eq '" + projectWorkId + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res && res.length > 0) {
        loadCompanyProjectWorkMaster({
          projectWorkMapping: res,
        });
      } else {
        loadCompanyProjectWorkMaster({
          projectWorkMapping: [],
        });
      }
    });
  }


  
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
      setAllCategories([...categories]);
    });
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
        loadCompanyProjectWorkMapping(res[0].ID);
      } else {
        setProjectWorkID(0);
        addKeyCompanies();
        loadCompanyProjectWorkMaster({
          projectWorkMapping: [],
        });
        loadCategoryMaster([]);
      }
    });
  }

  function init() {
    // setDeleteKeyCompanies([]);
    // _commonService = new CommonService();
    // let customProperty = {
    //   listName: _projectWorkCategoryMaster,
    // };
    // _commonService.getList(customProperty, (res: any) => {
    //   setAllCategories(res);
    //   loadCompanyData();
    // });
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
  }

  function inputChangeHandler(event: any, index: number): any {
    let allKeyCompanies = keyCompanies;
    allKeyCompanies[index][event.target.name] = event.target.value;
    setKeyCompanies([...allKeyCompanies]);
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
          console.log(formKeys[j] + " is required");
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
          insertOrUpdateProjectWorkMapping(res.data.Id);
        }
      );
      setAlert({
        open: true,
        severity: "success",
        message: "Inserted successfully",
      });
    } else {
      insertOrUpdateKeyCompany(projectWorkID);
      insertOrUpdateProjectWorkMapping(projectWorkID);
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
        }
      );
    }
  }

  function insertOrUpdateProjectWorkMapping(projectIDId: number) {
    let locTicketSizes = allTicketSizes.slice();
    let addData = locTicketSizes.filter((c) => c.ID == 0);
    let editData = locTicketSizes.filter((c) => c.ID != 0);
    addData.forEach((data) => {
      data.ProjectIDId = projectIDId;
      delete data.ID;
      delete data.Title;
    });

    editData.forEach((data) => {
      delete data.Title;
    });
    
    if (addData.length) {
      _commonService.bulkInsert(
        { listName: _projectWorkMapping },
        addData,
        (res) => {
          init();
        }
      );
    }

    if (editData.length) {
      _commonService.bulkUpdate(
        { listName: _projectWorkMapping },
        editData,
        (res) => {
          init();
        }
      );
    }
  }

  useEffect((): any => {
    init();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {" "}
      <h3 className={classes.headerTitle}>Company Profile</h3>
      <div className={classes.companyDetails}>
        <TextField
          style={{ width: "40%", marginRight: 30 }}
          id="outlined-basic"
          label="Company Name"
          size="small"
          variant="outlined"
          aria-readonly={true}
          name="CompanyName"
          value={props.CompanyName}
        />
        <TextField
          id="outlined-basic"
          size="small"
          label="ID"
          variant="outlined"
          style={{ width: 100 }}
          aria-readonly={true}
          value={props.CompanyCode}
        />
      </div>
      <h4 className={classes.headerTitle}>
        List and describe up to five (5) Key Company Differentiators (things
        that your team does often and well)
      </h4>
      {keyCompanies.map((company: any, index: number) => {
        return (
          <div className={classes.CategorySection}>
          
            <FormControl
              variant="outlined"
              style={{ width: "30%", margin: "8px 8px 8px 0" }}
            >
             <InputLabel id="demo-simple-select-outlined-label">
                Category
              </InputLabel>
              <Select
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
         
          
            <TextField
              id="outlined-basic"
              size="small"
              label="Description"
              variant="outlined"
              multiline
              style={{ width: "30%", margin: 8 }}
              value={company.Description}
              name="Description"
              onChange={(e) => inputChangeHandler(e, index)}
            />

            {keyCompanies.length == index + 1 && (
              <AddCircleOutlineIcon
                onClick={(e) => addKeyCompanies()}
                style={{
                  fontSize: 40,
                  color: theme.palette.primary.main,
                  margin: 8,
                  cursor:'pointer'
                }}
              />
            )}

            {keyCompanies.length > 1 && (
              <ClearIcon
                style={{
                  cursor: "pointer",
                  fontSize: 32,
                  color: theme.palette.error.main,
                }}
                onClick={(e) => removeKeyCompanies(index)}
              />
            )}
          </div>
        );
      })}
      <h4 className={classes.headerTitle}>
        Fill in the number of projects in the last 3 years and select average
        ticket size range per project
      </h4>
      <div className={classes.NoAndSizeSection}>
        {allTicketSizes.map((ticket: any, index: number) => {
          return (
            <div className={classes.NoAndSizeItem}>
              <p>{ticket.Title}</p>
              <div className={classes.InputSection}>
                <TextField
                  id="outlined-basic"
                  size="small"
                  label="#"
                  variant="outlined"
                  className={classes.TextInput}
                  value={ticket.Year}
                />
                <TextField
                  id="outlined-basic"
                  label="Size"
                  size="small"
                  variant="outlined"
                  className={ticket.Size}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className={classes.bottomBtnSection}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={(e) => submitData()}
        >
          Submit
        </Button>
      </div>
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
