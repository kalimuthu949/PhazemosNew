import * as React from "react";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CompanyProfile from "./CompanyProfile";
import TherapeuticExpertise from "./TherapeuticExpertise";
import RegulatoryExpertise from "./RegulatoryExpertise";
import Geography from "./Geography";
import ProjectWork from "./ProjectWork";
import PrimaryServicesOffered from "./PrimaryServicesOffered";
import { Upload } from "./Upload";
import BioQA from "./BioQA/BioQA";
import InHouseTools from "./InHouseTools/InHouseTools";
import PMExperience from "./PMExperience/PMExperience";
import SiteNetwork from "./SiteNetwork/SiteNetwork";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import ExpertisePlatform from "./ExpertisePlatform";

import CommonService from "../services/CommonService";
import { UserCustomActionRegistrationType } from "@pnp/sp/user-custom-actions";
import classes from "./CompanyProfile.module.scss";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
const theme = createTheme({
  palette: {
    primary: {
      main: "#00589A",
    },
  },
});

export interface IApp {
  CurrentContext: any;
  SiteUrl: string;
  Domain: any;
}

let pageChanges = false;
let clickedTabNumber = 0;
export const App: React.FunctionComponent<IApp> = (props: IApp) => {
  let _userDetails: string = "User Details";
  let _companyRegistration: string = "Company Registration";

  const [value, setValue] = useState(0);
  const [tabIndex, setTabIndex] = useState({});
  //const [pageChanges, setPageChanges] = useState(false);
  const ref = useRef(null);

  const [formData, setFormData] = useState({
    companyID: null,
    companyCode: null,
    companyName: null,
    companyProfile: false,
    therapeuticExpertise: false,
    regulatoryExpertise: false,
    geography: false,
    projectWork: false,
    primaryServicesOffered: false,
    uploads: false,
    expertisePlatform: false,
    bioQA: false,
    inHouseTools: false,
    PMExperience: false,
    SiteNetwork: false,
  });

  const handleChange = (event, newValue) => {
    clickedTabNumber = newValue;

    if (!pageChanges) setValue(newValue);
    else ref.current.pageAlert();
  };

  function changePageValue(value) {
    pageChanges = value;
    if (!value) {
      setValue(clickedTabNumber);
    }
  }

  function TabPanel(props) {
    const { children, value, index, CurrentContext, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-force-tabpanel-${index}`}
        aria-labelledby={`scrollable-force-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  function a11yProps(index) {
    return {
      id: `scrollable-force-tab-${index}`,
      "aria-controls": `scrollable-force-tabpanel-${index}`,
    };
  }

  function init() {
    let curuser = props.CurrentContext.pageContext.user.loginName;
    let userEmail = curuser;
    if (localStorage.getItem("_UserEmail_")) {
      let locuser = localStorage.getItem("_UserEmail_");
      userEmail = locuser;
      if (curuser != locuser) {
        localStorage.setItem("_IsReadOnly_", "1");
      } else {
        localStorage.setItem("_IsReadOnly_", "");
      }
    } else {
      localStorage.setItem("_IsReadOnly_", "");
    }

    let _commonService = new CommonService();
    let customProperty = {
      listName: _userDetails,
      filter: "UserEmailID eq '" + userEmail + "'",
    };
    _commonService.getList(customProperty, (userres: any) => {
      if (userres.length) {
        customProperty = {
          listName: _companyRegistration,
          filter: "ID eq '" + userres[0].CompanyIDId + "'",
        };
        _commonService.getList(customProperty, (res: any) => {
          let data = formData;
          data.companyID = res[0].ID;
          data.companyCode = res[0].CompanyID;
          data.companyName = res[0].Title;
          data.companyProfile = res[0].CompanyProfile;
          data.therapeuticExpertise = res[0].TherapeuticExpertise;
          data.regulatoryExpertise = res[0].RegulatoryExpertise;
          data.geography = res[0].Geography;
          data.projectWork = res[0].ProjectWork;
          data.primaryServicesOffered = res[0].PrimaryServicesOffered;
          data.uploads = res[0].Uploads;
          data.expertisePlatform = res[0].ExpertisePlatform;
          data.bioQA = res[0].bioMarkerQuals;
          data.inHouseTools = res[0].InHouseTools;
          data.PMExperience = res[0].PMExperience;
          data.SiteNetwork = res[0].SiteNetwork;

          let tab = tabIndex;
          let index = 0;
          if (data.companyProfile) {
            tab["companyProfile"] = index;
            index++;
          }
          if (data.therapeuticExpertise) {
            tab["therapeuticExpertise"] = index;
            index++;
          }
          if (data.regulatoryExpertise) {
            tab["regulatoryExpertise"] = index;
            index++;
          }
          if (data.expertisePlatform) {
            tab["expertisePlatform"] = index;
            index++;
          }
          if (data.geography) {
            tab["geography"] = index;
            index++;
          }
          if (data.projectWork) {
            tab["projectWork"] = index;
            index++;
          }
          if (data.primaryServicesOffered) {
            tab["primaryServicesOffered"] = index;
            index++;
          }
          if (data.uploads) {
            tab["uploads"] = index;
            index++;
          }
          if (data.bioQA) {
            tab["bioQA"] = index;
            index++;
          }
          if (data.inHouseTools) {
            tab["inHouseTools"] = index;
            index++;
          }
          if (data.PMExperience) {
            tab["PMExperience"] = index;
            index++;
          }
          if (data.SiteNetwork) {
            tab["SiteNetwork"] = index;
            index++;
          }
          setTabIndex({ ...tab });
          setFormData({ ...data });
        });
      }
    });
  }

  useEffect((): any => {
    init();
  }, []);
  // console.log(formData.uploads);
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          {formData.companyProfile && (
            <Tab
              label="Company Profile"
              {...a11yProps(tabIndex["companyProfile"])}
            />
          )}
          {formData.therapeuticExpertise && (
            <Tab
              label="Expertise - Therapeutic"
              {...a11yProps(tabIndex["therapeuticExpertise"])}
            />
          )}
          {formData.regulatoryExpertise && (
            <Tab
              label="Expertise - Regulatory"
              {...a11yProps(tabIndex["regulatoryExpertise"])}
            />
          )}

          {formData.expertisePlatform && (
            <Tab
              label="Expertise - Platform"
              {...a11yProps(tabIndex["expertisePlatform"])}
            />
          )}

          {formData.geography && (
            <Tab
              label="Resource Locations"
              {...a11yProps(tabIndex["geography"])}
            />
          )}
          {formData.projectWork && (
            <Tab label="Project Work" {...a11yProps(tabIndex["projectWork"])} />
          )}

          {formData.companyProfile && (
            <Tab
              label="Primary Services Offered"
              {...a11yProps(tabIndex["primaryServicesOffered"])}
            />
          )}

          {formData.uploads && (
            <Tab label="Uploads" {...a11yProps(tabIndex["uploads"])} />
          )}

          {formData.bioQA && (
            <Tab
              label="Qualified Biomarkers"
              {...a11yProps(tabIndex["bioQA"])}
            />
          )}
          {formData.inHouseTools && (
            <Tab
              label="In House Tools"
              {...a11yProps(tabIndex["inHouseTools"])}
            />
          )}
          {formData.PMExperience && (
            <Tab
              label="PM Experience"
              {...a11yProps(tabIndex["PMExperience"])}
            />
          )}
          {formData.SiteNetwork && (
            <Tab
              label="Site Relationships"
              {...a11yProps(tabIndex["SiteNetwork"])}
            />
          )}
        </Tabs>
      </AppBar>

      {formData.companyProfile && (
        <TabPanel value={value} index={tabIndex["companyProfile"]}>
          <CompanyProfile
            CompanyName={formData.companyName}
            CompanyID={formData.companyID}
            CompanyCode={formData.companyCode}
            changefunction={changePageValue}
            ref={ref}
          />
        </TabPanel>
      )}

      {formData.therapeuticExpertise && (
        <TabPanel value={value} index={tabIndex["therapeuticExpertise"]}>
          <TherapeuticExpertise
            CompanyName={formData.companyName}
            CompanyID={formData.companyID}
            CompanyCode={formData.companyCode}
            changefunction={changePageValue}
            ref={ref}
          />
        </TabPanel>
      )}

      {formData.regulatoryExpertise && (
        <TabPanel value={value} index={tabIndex["regulatoryExpertise"]}>
          <RegulatoryExpertise
            CompanyName={formData.companyName}
            CompanyID={formData.companyID}
            CompanyCode={formData.companyCode}
            changefunction={changePageValue}
            ref={ref}
          />
        </TabPanel>
      )}

      {formData.expertisePlatform && (
        <TabPanel value={value} index={tabIndex["expertisePlatform"]}>
          <ExpertisePlatform
            CompanyName={formData.companyName}
            CompanyID={formData.companyID}
            CompanyCode={formData.companyCode}
            changefunction={changePageValue}
            ref={ref}
          />
        </TabPanel>
      )}

      {formData.geography && (
        <TabPanel value={value} index={tabIndex["geography"]}>
          <Geography
            CompanyName={formData.companyName}
            CompanyID={formData.companyID}
            CompanyCode={formData.companyCode}
            changefunction={changePageValue}
            ref={ref}
          />
        </TabPanel>
      )}

      {formData.projectWork && (
        <TabPanel value={value} index={tabIndex["projectWork"]}>
          <ProjectWork
            CompanyName={formData.companyName}
            CompanyID={formData.companyID}
            CompanyCode={formData.companyCode}
            changefunction={changePageValue}
            ref={ref}
          />
        </TabPanel>
      )}

      {formData.companyProfile && (
        <TabPanel value={value} index={tabIndex["primaryServicesOffered"]}>
          <PrimaryServicesOffered
            CompanyName={formData.companyName}
            CompanyID={formData.companyID}
            CompanyCode={formData.companyCode}
            changefunction={changePageValue}
            ref={ref}
          />
        </TabPanel>
      )}

      {formData.uploads && (
        <TabPanel value={value} index={tabIndex["uploads"]}>
          <Upload
            CompanyName={formData.companyName}
            CompanyID={formData.companyID}
            CompanyCode={formData.companyCode}
            SiteUrl={props.SiteUrl}
            Domain={props.Domain}
          />
        </TabPanel>
      )}

      {formData.bioQA && (
        <TabPanel value={value} index={tabIndex["bioQA"]}>
          <BioQA
            CompanyName={formData.companyName}
            CompanyID={formData.companyID}
            CompanyCode={formData.companyCode}
            changefunction={changePageValue}
            ref={ref}
          />
        </TabPanel>
      )}
      {formData.inHouseTools && (
        <TabPanel value={value} index={tabIndex["inHouseTools"]}>
          <InHouseTools
            CompanyName={formData.companyName}
            CompanyID={formData.companyID}
            CompanyCode={formData.companyCode}
            changefunction={changePageValue}
            ref={ref}
          />
        </TabPanel>
      )}
      {formData.PMExperience && (
        <TabPanel value={value} index={tabIndex["PMExperience"]}>
          <PMExperience
            CompanyName={formData.companyName}
            CompanyID={formData.companyID}
            CompanyCode={formData.companyCode}
            changefunction={changePageValue}
            ref={ref}
          />
        </TabPanel>
      )}
      {formData.SiteNetwork && (
        <TabPanel value={value} index={tabIndex["SiteNetwork"]}>
          <SiteNetwork
            CompanyName={formData.companyName}
            CompanyID={formData.companyID}
            CompanyCode={formData.companyCode}
            changefunction={changePageValue}
            ref={ref}
          />
        </TabPanel>
      )}
    </ThemeProvider>
  );
};
