import * as React from "react";
import TextField from "@material-ui/core/TextField";
import classes from "./ExpertisePlatform.module.scss";
import { useState, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top

import CommonService from "../services/CommonService";

import { CustomAlert } from "./CustomAlert";

export interface IExpertisePlatform {
  CompanyName: string;
  CompanyCode: string;
  CompanyID: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#00589A",
    },
  },
});

export const ExpertisePlatform: React.FunctionComponent<
  IExpertisePlatform
> = (props: IExpertisePlatform) => {
  var _commonService: any = {};

  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });

  const [readOnly, setReadOnly] = useState(false);

  const _expertisePlatform: string = "ExpertisePlatform";
  const _expertisePlatformMap: string = "Expertise Platform Mapping";
  const _expertisePlatformMaster: string = "Expertise Platform Master";
  

  const [expertisePlatform, setExpertisePlatform] = useState([]); 

  const [companyExpertisePlatform, setCompanyExpertisePlatform] = useState({
    expertisePlatform: null,
    expertisePlatformMapping: []
  });


  function loadActiveExpertisePlatformExperience(editData: any) {
    let customProperty = {
      listName: _expertisePlatformMaster,
      properties: "ID,Title,IsActive",
      orderby: "OrderNo",
      orderbyAsc: true,
    };
    _commonService.getList(customProperty, (res: any[]) => {
      let expertisePlatforms = [];
      for (let index = 0; index < res.length; index++) {
        let editMap = editData.expertisePlatformMapping.filter(
          (c) => c.ExpertisePlatformMasterIDId == res[index].Id
        );
        if (editMap.length || res[index].IsActive) {
          let data = {
            ExpertisePlatformIDId: 0,
            ExpertisePlatformMasterIDId: res[index].Id,
            serviceName: res[index].Title,
            IsChecked: false,
            ID: 0,
          };
          if (editMap.length) {
            data.ExpertisePlatformIDId = editMap[0].ExpertisePlatformIDId;
            data.ID = editMap[0].ID;
            data.IsChecked = true;
          }
          expertisePlatforms.push(data);
        }
      }
      setExpertisePlatform([...expertisePlatforms]);
    });
  }

  function loadCompanyExpertisePlatform() {
    let customProperty = {
      listName: _expertisePlatform,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res && res.length > 0) {
        loadCompanyExperiencePlatformMapping(res[0]);
      } else {
        loadActiveExpertisePlatformExperience({
          expertisePlatform: null,
          expertisePlatformMapping: []
        });
      }
    });
  }

  function loadCompanyExperiencePlatformMapping(res: any) {
    let customProperty = {
      listName: _expertisePlatformMap,
      filter: "ExpertisePlatformIDId eq '" + res.ID + "' and IsDeleted eq 0",
      expand: "ExpertisePlatformMasterID",
      properties: "*,ExpertisePlatformMasterID/Title",
    };
    _commonService.getList(customProperty, (mapres: any) => {
      let editData: any = {};
      editData.expertisePlatform = res;
      editData.expertisePlatformMapping = [...mapres];
      setCompanyExpertisePlatform(editData);
      loadActiveExpertisePlatformExperience(editData);
    });
  }


  function init() {
    if (localStorage.getItem("_IsReadOnly_")) {
      setReadOnly(true);
    } else {
      setReadOnly(false);
    }


    setExpertisePlatform([]);
    setCompanyExpertisePlatform({
      expertisePlatform: null,
      expertisePlatformMapping: []
    });
    loadCompanyExpertisePlatform();
  }

  function expertisePlatformChangeHandler(index: number, event: any) {
    let expertisePlatforms = expertisePlatform;
    expertisePlatforms[index][event.target.name] = event.target.checked;
    setExpertisePlatform([...expertisePlatforms]);
  }

  function submitData() {
    _commonService = new CommonService();

    if (!companyExpertisePlatform.expertisePlatform) {
      insertExpertisePlatform();
    } else {
      updateExpertisePlatform();
    }
  }

  function insertExpertisePlatform() {
    let expertisePlatformPostData: any[] = [];
    _commonService.insertIntoList(
      {
        listName: _expertisePlatform,
      },
      { CompanyIDId: props.CompanyID },
      (res: any) => {
        
        let locExpertisePlatform = expertisePlatform.slice();
        locExpertisePlatform.forEach((expertisePlatform: any) => {
          if (expertisePlatform.IsChecked) {
            expertisePlatformPostData.push({
              ExpertisePlatformIDId: res.data.Id,
              ExpertisePlatformMasterIDId:
              expertisePlatform.ExpertisePlatformMasterIDId,
            });
          }
        });

        
        if (expertisePlatformPostData.length > 0) {
          _commonService.bulkInsert(
            { listName: _expertisePlatformMap },
            expertisePlatformPostData,
            (bulkres: any) => {
              init();
            }
          );
        }

      }
    );
    setAlert({
      open: true,
      severity: "success",
      message: "Inserted successfully",
    });
    setTimeout(() => {
      init();
    }, 3000);
  }
 

  function updateExpertisePlatform() {
    updateExpertisePlatformMap();
    setAlert({
      open: true,
      severity: "success",
      message: "Updated successfully",
    });
  }

  function updateExpertisePlatformMap() {
    let locCompanyExpertisePlatform = companyExpertisePlatform;
    let locExpertisePlatform = expertisePlatform.slice();
    let addExpertise = locExpertisePlatform.filter(
      (c) => c.ExpertisePlatformIDId == 0 && c.IsChecked == true
    );
    let removedExpertise = locExpertisePlatform.filter(
      (c) => c.ExpertisePlatformIDId != 0 && c.IsChecked == false
    );
    if (addExpertise.length) {
      addExpertise.forEach((v) => {
        v.ExpertisePlatformIDId =
        locCompanyExpertisePlatform.expertisePlatform.ID;
        delete v.serviceName;
        delete v.ID;
        delete v.IsChecked;
      });
      _commonService.bulkInsert(
        { listName: _expertisePlatformMap },
        addExpertise,
        (bulkres: any) => {
          init();
        }
      );
    }
    if (removedExpertise.length) {
      removedExpertise.forEach((v) => {
        v.IsDeleted = true;
        delete v.serviceName;
        delete v.IsChecked;
      });
      _commonService.bulkUpdate(
        { listName: _expertisePlatformMap },
        removedExpertise,
        (bulkres: any) => {
          init();
        }
      );
    }
  }
   
  useEffect((): any => {
    _commonService = new CommonService();
    init();
  }, []);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <ThemeProvider theme={theme}>
      
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


      <div className={classes.AreaExperience}>
        <p>Platform Area Experience (check "x" all that apply)</p>

        <div className={classes.CheckboxSection}>
          {expertisePlatform.map((service: any, index: number) => {
            return (
              <div className={classes.Checkbox}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={service.IsChecked}
                      onChange={(e) => expertisePlatformChangeHandler(index, e)}
                      name="IsChecked"
                      color="primary"
                      disabled={readOnly}
                    />
                  }
                  label={service.serviceName}
                />
              </div>
            );
          })}
        </div>
      </div>
      

      {!readOnly && (
        <div className={classes.bottomBtnSection} style={{ marginTop: 20 }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
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
};
export default ExpertisePlatform;
