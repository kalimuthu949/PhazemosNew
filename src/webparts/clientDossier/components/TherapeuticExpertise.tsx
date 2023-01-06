import * as React from "react";
import TextField from "@material-ui/core/TextField";
import classes from "./TherapeuticExpertise.module.scss";
import { useState, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top

import CommonService from "../services/CommonService";

import { CustomAlert } from "./CustomAlert";

export interface ITherapeuticExpertise {
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

export const TherapeuticExpertise: React.FunctionComponent<
  ITherapeuticExpertise
> = (props: ITherapeuticExpertise) => {
  var _commonService: any = {};

  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });

  const _therapeuticExpertise: string = "Therapeutic Expertise";
  const _therapeuticAreaMap: string = "Therapeutic Area Experience Mapping";
  const _therapeuticAreaMaster: string = "Therapeutic Area Experience Master";
  const _diseaseAreaMap: string = "Disease Area Experience Mapping";
  const _diseaseAreaMaster: string = "Disease Area Experience Master";

  const [therapeuticArea, setTherapeuticArea] = useState([]);
  const [diseaseArea, setDiseaseArea] = useState([]);
  const [selDiseaseArea, setSelDiseaseArea] = useState([]);
  const [editDiseaseArea, setEditDiseaseArea] = useState([]);

  const [companyTherapeuticArea, setCompanyTherapeuticArea] = useState({
    therapeuticExpertise: null,
    therapeuticAreaMapping: [],
    diseaseAreaMapping: [],
  });

  function loadActiveTherapeuticAreaExperience(editData: any) {
    let customProperty = {
      listName: _therapeuticAreaMaster,
      properties: "ID,Title,IsActive",
      orderby: "OrderNo",
      orderbyAsc: true,
    };
    _commonService.getList(customProperty, (res: any[]) => {
      let therapeuticAreas = [];
      for (let index = 0; index < res.length; index++) {
        let editMap = editData.therapeuticAreaMapping.filter(
          (c) => c.TherapeuticAreaExpMasterIDId == res[index].Id
        );
        if (editMap.length || res[index].IsActive) {
          let data = {
            TherapeuticExpertiseIDId: 0,
            TherapeuticAreaExpMasterIDId: res[index].Id,
            serviceName: res[index].Title,
            IsChecked: false,
            ID: 0,
          };
          if (editMap.length) {
            data.TherapeuticExpertiseIDId = editMap[0].TherapeuticExpertiseIDId;
            data.ID = editMap[0].ID;
            data.IsChecked = true;
          }
          therapeuticAreas.push(data);
        }
      }
      setTherapeuticArea([...therapeuticAreas]);
      loadActiveDiseaseAreaExperience(editData);
    });
  }

  function loadActiveDiseaseAreaExperience(editData: any) {
    let customProperty = {
      listName: _diseaseAreaMaster,
      properties: "ID,Title,IsActive",
      orderby: "OrderNo",
      orderbyAsc: true,
    };
    _commonService.getList(customProperty, (res: any[]) => {
      let diseaseAreas = [];
      let selectedDiseases = [];

      for (let index = 0; index < res.length; index++) {
        let editMap = editData.diseaseAreaMapping.filter(
          (c) => c.DiseaseAreaExperienceIDId == res[index].Id
        );
        if (editMap.length || res[index].IsActive) {
          let data = {
            TherapeuticExpertiseIDId: 0,
            DiseaseAreaExperienceIDId: res[index].Id,
            serviceName: res[index].Title,
            IsChecked: false,
            ID: 0,
          };
          if (editMap.length) {
            data.TherapeuticExpertiseIDId = editMap[0].TherapeuticExpertiseIDId;
            data.ID = editMap[0].ID;
            data.IsChecked = true;
            selectedDiseases.push(data);
          }
          diseaseAreas.push(data);
        }
      }
      setDiseaseArea([...diseaseAreas]);
      setSelDiseaseArea([...selectedDiseases]);
      setEditDiseaseArea([...selectedDiseases]);
    });
  }

  function loadCompanyTherapeuticExpertise() {
    let customProperty = {
      listName: _therapeuticExpertise,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res && res.length > 0) {
        loadCompanyTherapeuticAreaExperienceMapping(res[0]);
      } else {
        loadActiveTherapeuticAreaExperience({
          therapeuticExpertise: null,
          therapeuticAreaMapping: [],
          diseaseAreaMapping: [],
        });
      }
    });
  }

  function loadCompanyTherapeuticAreaExperienceMapping(res: any) {
    let customProperty = {
      listName: _therapeuticAreaMap,
      filter: "TherapeuticExpertiseIDId eq '" + res.ID + "' and IsDeleted eq 0",
      // filter: "RegulatoryExpertiseIDId eq '" + res.ID + "'",
      expand: "TherapeuticAreaExpMasterID",
      properties: "*,TherapeuticAreaExpMasterID/Title",
    };
    _commonService.getList(customProperty, (mapres: any) => {
      let editData: any = {};
      editData.therapeuticExpertise = res;
      editData.therapeuticAreaMapping = [...mapres];
      loadCompanyDiseaseAreaExperienceMapping(editData);
    });
  }

  function loadCompanyDiseaseAreaExperienceMapping(editData: any) {
    let customProperty = {
      listName: _diseaseAreaMap,
      filter:
        "TherapeuticExpertiseIDId eq '" +
        editData.therapeuticExpertise.ID +
        "' and IsDeleted eq 0",
      expand: "DiseaseAreaExperienceID",
      properties: "*,DiseaseAreaExperienceID/Title",
    };
    _commonService.getList(customProperty, (mapres: any) => {
      editData.therapeuticExpertise = editData.therapeuticExpertise;
      editData.diseaseAreaMapping = [...mapres];
      editData.therapeuticAreaMapping = editData.therapeuticAreaMapping.slice();
      setCompanyTherapeuticArea(editData);
      loadActiveTherapeuticAreaExperience(editData);
    });
  }

  function init() {
    setTherapeuticArea([]);
    setDiseaseArea([]);
    setSelDiseaseArea([]);
    setCompanyTherapeuticArea({
      therapeuticExpertise: null,
      therapeuticAreaMapping: [],
      diseaseAreaMapping: [],
    });
    loadCompanyTherapeuticExpertise();
  }

  function therapeuticAreaChangeHandler(index: number, event: any) {
    let therapeuticAreas = therapeuticArea;
    therapeuticAreas[index][event.target.name] = event.target.checked;
    setTherapeuticArea([...therapeuticAreas]);
  }

  // function diseaseAreaChangeHandler(index: number, event: any) {
  //   let diseaseAreas = diseaseArea;
  //   diseaseAreas[index][event.target.name] = event.target.checked;
  //   setDiseaseArea([...diseaseArea]);
  // }

  function diseaseAreaChangeHandler(event: any) {
    debugger;
  }

  function submitData() {
    _commonService = new CommonService();

    if (!companyTherapeuticArea.therapeuticExpertise) {
      insertTherapeuticExpertise();
    } else {
      updateTherapeuticExpertise();
    }
  }

  function insertTherapeuticExpertise() {
    let therapeuticAreaPostData: any[] = [];
    _commonService.insertIntoList(
      {
        listName: _therapeuticExpertise,
      },
      { CompanyIDId: props.CompanyID },
      (res: any) => {
        //TherapeuticArea
        let locTherapeuticArea = therapeuticArea.slice();
        locTherapeuticArea.forEach((therapeuticArea: any) => {
          if (therapeuticArea.IsChecked) {
            therapeuticAreaPostData.push({
              TherapeuticExpertiseIDId: res.data.Id,
              TherapeuticAreaExpMasterIDId:
                therapeuticArea.TherapeuticAreaExpMasterIDId,
            });
          }
        });

        //DiseaseArea
        let diseaseAreaPostData: any[] = [];
        let locDiseaseArea = selDiseaseArea.slice();
        locDiseaseArea.forEach((diseaseArea: any) => {
          if (diseaseArea.IsChecked) {
            diseaseAreaPostData.push({
              TherapeuticExpertiseIDId: res.data.Id,
              DiseaseAreaExperienceIDId: diseaseArea.DiseaseAreaExperienceIDId,
            });
          }
        });

        //TherapeuticArea
        if (therapeuticAreaPostData.length > 0) {
          _commonService.bulkInsert(
            { listName: _therapeuticAreaMap },
            therapeuticAreaPostData,
            (bulkres: any) => {}
          );
        }

        //DiseaseArea
        if (diseaseAreaPostData.length > 0) {
          let newDisease = locDiseaseArea.filter(
            (c) => c.DiseaseAreaExperienceIDId == 0
          );

          if (newDisease.length > 0) {
            insertNewDieaseMaterData(0, res.data.Id, newDisease);
          }

          let exisitingDisease = diseaseAreaPostData.filter(
            (c) => c.DiseaseAreaExperienceIDId != 0
          );

          if (exisitingDisease.length > 0) {
            insertDiseaseMapping(exisitingDisease);
          }
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

  function insertDiseaseMapping(diseaseAreaPostData) {
    _commonService.bulkInsert(
      { listName: _diseaseAreaMap },
      diseaseAreaPostData,
      (bulkres: any) => {}
    );
  }

  function insertNewDieaseMaterData(
    index: number,
    therapeuticExpertiseIDId: any,
    newDisease: any[]
  ) {
    _commonService.insertIntoList(
      { listName: _diseaseAreaMaster },
      { Title: newDisease[index].serviceName, IsActive: true },
      (res) => {
        var postData = {
          TherapeuticExpertiseIDId: therapeuticExpertiseIDId,
          DiseaseAreaExperienceIDId: res.data.Id,
        };
        _commonService.insertIntoList(
          { listName: _diseaseAreaMap },
          postData,
          (res) => {}
        );

        index++;
        if (index != newDisease.length) {
          insertNewDieaseMaterData(index, therapeuticExpertiseIDId, newDisease);
        }
      }
    );
  }

  function updateTherapeuticExpertise() {
    updateTherapeuticArea();
    updateDiseaseMap();
    setAlert({
      open: true,
      severity: "success",
      message: "Updated successfully",
    });
    init();
  }

  function updateTherapeuticArea() {
    let locCompanyTherapeuticArea = companyTherapeuticArea;
    let locTherapeuticArea = therapeuticArea.slice();
    let addTherapetic = locTherapeuticArea.filter(
      (c) => c.TherapeuticExpertiseIDId == 0 && c.IsChecked == true
    );
    let removedTherapetic = locTherapeuticArea.filter(
      (c) => c.TherapeuticExpertiseIDId != 0 && c.IsChecked == false
    );
    if (addTherapetic.length) {
      addTherapetic.forEach((v) => {
        v.TherapeuticExpertiseIDId =
          locCompanyTherapeuticArea.therapeuticExpertise.ID;
        delete v.serviceName;
        delete v.ID;
        delete v.IsChecked;
      });
      _commonService.bulkInsert(
        { listName: _therapeuticAreaMap },
        addTherapetic,
        (bulkres: any) => {}
      );
    }
    if (removedTherapetic.length) {
      removedTherapetic.forEach((v) => {
        v.IsDeleted = true;
        delete v.serviceName;
        delete v.IsChecked;
      });
      _commonService.bulkUpdate(
        { listName: _therapeuticAreaMap },
        removedTherapetic,
        (bulkres: any) => {}
      );
    }
  }

  function updateDiseaseMap() {
    let locCompanyTherapeuticArea = companyTherapeuticArea;
    let locDiseaseArea = selDiseaseArea.slice();
    let addDiseaseArea = locDiseaseArea.filter(
      (c) =>
        c.TherapeuticExpertiseIDId == 0 &&
        c.DiseaseAreaExperienceIDId != 0 &&
        c.IsChecked == true
    );

    let newDiseases = locDiseaseArea.filter(
      (c) => c.DiseaseAreaExperienceIDId == 0 && c.IsChecked == true
    );

    if (newDiseases.length > 0) {
      insertNewDieaseMaterData(
        0,
        locCompanyTherapeuticArea.therapeuticExpertise.ID,
        newDiseases
      );
    }

    var removedDiseaseArea = editDiseaseArea.filter(
      (edit) => !locDiseaseArea.some((loc) => edit.ID === loc.ID && loc.ID != 0)
    );

    if (addDiseaseArea.length) {
      addDiseaseArea.forEach(function (v) {
        v.TherapeuticExpertiseIDId =
          locCompanyTherapeuticArea.therapeuticExpertise.ID;
        delete v.serviceName;
        delete v.ID;
        delete v.IsChecked;
      });
      _commonService.bulkInsert(
        { listName: _diseaseAreaMap },
        addDiseaseArea,
        (bulkres: any) => {}
      );
    }
    if (removedDiseaseArea.length) {
      removedDiseaseArea.forEach(function (v) {
        v.IsDeleted = true;
        delete v.serviceName;
        delete v.IsChecked;
      });
      _commonService.bulkUpdate(
        { listName: _diseaseAreaMap },
        removedDiseaseArea,
        (bulkres: any) => {}
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
      <h3 className={classes.headerTitle}>Expertise - Therapeutic </h3>
      <div className={classes.companyDetails}>
        <TextField
          style={{ width: "40%", marginRight: 30 }}
          id="outlined-basic"
          label="Company Name"
          variant="outlined"
          aria-readonly={true}
          name="CompanyName"
          value={props.CompanyName}
        />
        <TextField
          id="outlined-basic"
          label="ID"
          variant="outlined"
          style={{ width: 100 }}
          aria-readonly={true}
          value={props.CompanyCode}
        />
      </div>
      <div className={classes.AreaExperience}>
        <p>Therapeutic Area Experience (check "x" all that apply)</p>

        <div className={classes.CheckboxSection}>
          {therapeuticArea.map((service: any, index: number) => {
            return (
              <div className={classes.Checkbox}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={service.IsChecked}
                      onChange={(e) => therapeuticAreaChangeHandler(index, e)}
                      name="IsChecked"
                      color="primary"
                    />
                  }
                  label={service.serviceName}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className={classes.AreaDisease}>
        <p>Disease Area Experience</p>
        <Autocomplete
          multiple
          freeSolo
          id="checkboxes-tags-demo"
          options={diseaseArea}
          disableCloseOnSelect
          getOptionLabel={(option) => option.serviceName}
          value={selDiseaseArea}
          onChange={(event: any, newValue: any[]) => {
            var datas = [];
            newValue.map((d) => {
              if (!d.DiseaseAreaExperienceIDId) {
                var newDisease = {
                  DiseaseAreaExperienceIDId: 0,
                  ID: 0,
                  IsChecked: true,
                  TherapeuticExpertiseIDId: 0,
                  serviceName: d,
                };
                datas.push(newDisease);
              } else {
                d.IsChecked = true;
                datas.push(d);
              }
            });
            setSelDiseaseArea([...datas]);
          }}
          renderOption={(option, { selected }) => (
            <React.Fragment>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.serviceName}
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Disease Area Experience"
            />
          )}
        />
      </div>
      <div className={classes.bottomBtnSection} style={{ marginTop: 20 }}>
        <Button
          variant="contained"
          color="primary"
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
export default TherapeuticExpertise;
