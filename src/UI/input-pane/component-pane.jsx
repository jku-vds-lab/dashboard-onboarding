import Components from "./component-properties";
import { Accordion } from "react-bootstrap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

import "../assets/css/dashboard.scss";
import icon from "../nodes-canvas/icon-1.svg";
import c_icon from "../assets/img/icon-1.png";
import c_icon_2 from "../assets/img/icon-6.png";
import c_icon_3 from "../assets/img/icon-5.png";
import c_icon_4 from "../assets/img/icon-3.png";
import c_icon_5 from "../assets/img/icon-2.png";
import c_icon_6 from "../assets/img/icon-4.png";
import { allVisuals } from "../../onboarding/ts/globalVariables";

export default function ComponentPane() {
    const tabsData = [];

    let tab =  { eventKey: 'dashboard', tooltip: 'Dashboard', iconSrc: c_icon, className: 'dashboard', headerText: 'Dashboard' };
    tabsData.push(tab);
    
    for(let i = 0; i < allVisuals.length; i++){
        const tab = {};
        let visData = getVisData(allVisuals[i]);
        tab.eventKey = allVisuals[i].name;
        tab.tooltip = visData[0];
        tab.iconSrc = visData[2];
        tab.className = visData[1];
        tab.headerText = visData[0] + " " + allVisuals[i].title;
        tabsData[i+1] = tab;
    }

    tab = { eventKey: 'globalFilters', tooltip: 'Global Filters', iconSrc: c_icon_2, className: 'globalFilters', headerText: 'Global Filters' };
    tabsData.push(tab);

    function getVisData(visual) {
        let icon = "";
        let type = "";
        let name = "";
        const VisualType = visual.type;
        switch(VisualType){
            case 'card': case "multiRowCard":
                name = "KPI";
                type = "kpi";
                icon = c_icon_3;
                break;
            case 'slicer':
                name = "Filter";
                type = "filter";
                icon = c_icon_2;
                break;
            case 'lineChart':
                name = "Line Chart";
                type = "lineChart";
                icon = c_icon_5;
                break;
            case 'clusteredBarChart':
                name = "Bar Chart";
                type = "barChart";
                icon = c_icon_6;
                break;
            case 'clusteredColumnChart':
                name = "Column Chart";
                type = "columnChart";
                icon = c_icon_4;
                break;
            case 'lineClusteredColumnComboChart':
                name = "Combo Chart";
                type = "comboChart";
                icon = c_icon_4;
                break;
            default:
                name = VisualType;
                type = VisualType;
                icon = c_icon_4;
                break;
        }
        return [name, type, icon];
      }

    function TabItem({ eventKey, tooltip, iconSrc }) {
        return (
            <Nav.Item>
                <Nav.Link eventKey={eventKey}>
                    <OverlayTrigger trigger="hover" placement="right" overlay={
                        <Tooltip >
                            {tooltip}
                        </Tooltip>
                    }>
                        <img className="icon options"
                             src={iconSrc}
                             width="18px"
                             height="18px" alt="Component icon" />
                    </OverlayTrigger>
                </Nav.Link>
            </Nav.Item>
        )
    }

    function TabPaneItem({ eventKey, className, headerText }) {
        return (
            <Tab.Pane eventKey={eventKey} >
                <div className="tab-body-header"><span>{headerText}</span><span className="color-box"></span></div>
                <Components visual={eventKey}/>
            </Tab.Pane>
        )
    }
  return (
      <div>
          <div className="label">Components</div>
          <Tab.Container id="component-graph" defaultActiveKey="first">
              <div className="tabs-container">
                  <Nav variant="pills" className="flex-column icon-nav">
                      {tabsData.map(tab =>
                          <TabItem
                              key={tab.eventKey}
                              eventKey={tab.eventKey}
                              tooltip={tab.tooltip}
                              iconSrc={tab.iconSrc}
                          />
                      )}
                  </Nav>
                  <Tab.Content>
                      {tabsData.map(tab =>
                        <div  key={tab.eventKey}>
                          <TabPaneItem
                              eventKey={tab.eventKey}
                              className={tab.className}
                              headerText={tab.headerText}
                          />
                        </div>
                      )}
                  </Tab.Content>
              </div>
          </Tab.Container>

      </div>
  );
}
