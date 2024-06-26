import Components from "./component-properties";
import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { PhotoshopPicker } from "react-color";
import { Nav, Tab, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import * as global from "../../onboarding/ts/globalVariables";

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
  const [tabsData, setTabsData] = useState([
    {
      eventKey: "dashboard",
      tooltip: "Dashboard",
      iconSrc: c_icon,
      headerText: "Dashboard",
      colorVariable: "--dashboard-color",
      colorValue: "#4e91e9",
      components: [
        {
          visualId: "dashboard",
          title: global.page.displayName,
        },
      ],
    },
    {
      eventKey: "filter",
      tooltip: "Filter",
      iconSrc: c_icon_2,
      headerText: "Filter",
      colorVariable: "--filter-color",
      colorValue: "#e7298a",
      components: [
        {
          visualId: "globalFilters",
          title: "Global Filters",
        },
      ],
    },
  ]);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [componentColor, setComponentColor] = useState(
    tabsData
      ? "#4e91e9"
      : tabsData.find((tab) => tab.eventKey === selectedTab).colorValue
  );

  useEffect(() => {
    getTabsDataOfVisuals();

    const root = document.documentElement;
    tabsData.forEach((tab) => {
      root.style.setProperty(tab.colorVariable, tab.colorValue);
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const selectedColorVariable = tabsData.find(
      (tab) => tab.eventKey === selectedTab
    ).colorVariable;
    root.style.setProperty(selectedColorVariable, componentColor);
  }, [selectedTab, componentColor, tabsData]);

  const showPicker = () => {
    // Perform necessary actions on cancel
    setPickerVisible(true); // Hide the PhotoshopPicker
  };

  function getTabsDataOfVisuals() {
    for (let i = 0; i < allVisuals.length; i++) {
      let visData = getVisData(allVisuals[i]);
      const existingTab = tabsData.find((tab) => tab.eventKey === visData[1]);
      console.log("Visdata", visData);

      if (existingTab) {
        const newVis = {
          visualId: allVisuals[i].name,
          title: allVisuals[i].title,
        };

        existingTab.components.push(newVis);
      } else {
        const tab = {};
        tab.eventKey = visData[1];
        tab.tooltip = visData[0];
        tab.iconSrc = visData[2];
        tab.headerText = visData[0];
        tab.colorVariable = visData[3];
        tab.colorValue = visData[4];
        tab.components = [
          {
            visualId: allVisuals[i].name,
            title: allVisuals[i].title,
          },
        ];
        tabsData.push(tab);
      }
    }
  }

  const handleAccept = (color) => {
    const selectedTabData = tabsData.find(
      (tab) => tab.eventKey === selectedTab
    );
    const selectedColorVariable = selectedTabData
      ? selectedTabData.colorVariable
      : "";

    setTabsData((prevTabsData) => {
      return prevTabsData.map((tab) => {
        if (tab.eventKey === selectedTab) {
          return {
            ...tab,
            colorValue: componentColor,
          };
        }
        return tab;
      });
    });
    // console.log("HERE");
    // console.log(tabsData);
    // Update the CSS variable using document.documentElement
    const root = document.documentElement;
    root.style.setProperty(selectedColorVariable, componentColor);

    setPickerVisible(false);
  };

  const handleOnChangeComplete = (color) => {
    setComponentColor(color.hex);
  };

  // Function to handle the cancel action
  const handleCancel = () => {
    // Perform necessary actions on cancel
    setPickerVisible(false); // Hide the PhotoshopPicker
  };

  function getVisData(visual) {
    let icon = "";
    let type = "";
    let name = "";
    let variable = "";
    let color = "";
    const VisualType = visual.type;
    switch (VisualType) {
      case "card":
      case "multiRowCard":
        name = "KPI";
        type = "kpi";
        icon = c_icon_3;
        variable = "--kpi-color";
        color = "#7570b3";
        break;
      case "slicer":
        name = "Filter";
        type = "filter";
        icon = c_icon_2;
        color = "#e7298a";
        variable = "--filter-color";
        break;
      case "lineChart":
        name = "Line Chart";
        type = "lineChart";
        icon = c_icon_5;
        variable = "--line-chart-color";
        color = "#d95f02";
        break;
      case "clusteredBarChart":
        name = "Bar Chart";
        type = "barChart";
        icon = c_icon_6;
        variable = "--bar-chart-color";
        color = "#1b9e77";
        break;
      case "clusteredColumnChart":
        name = "Column Chart";
        type = "columnChart";
        icon = c_icon_4;
        variable = "--column-chart-color";
        color = "#66a61e";
        break;
      case "lineClusteredColumnComboChart":
        name = "Combo Chart";
        type = "comboChart";
        icon = c_icon_4;
        variable = "--combo-chart-color";
        color = "#EDB464";
        break;
      default:
        name = VisualType;
        type = VisualType;
        icon = c_icon_4;
        variable = "--default-color";
        color = "#545454";
        break;
    }
    return [name, type, icon, variable, color];
  }

  function TabItem({ eventKey, tooltip, iconSrc }) {
    const handleClick = () => {
      setSelectedTab(eventKey);
      const selectedTabData = tabsData.find((tab) => tab.eventKey === eventKey);
      const selectedColor = selectedTabData ? selectedTabData.colorValue : "";
      setComponentColor(selectedColor);
    };
    return (
      <Nav.Item>
        <Nav.Link eventKey={eventKey} onClick={handleClick}>
          {/* <OverlayTrigger
            trigger={["hover", "focus"]}
            placement="left"
            overlay={<Tooltip>{tooltip}</Tooltip>}
          > */}
          <img
            className="icon options"
            src={iconSrc}
            width="18px"
            height="18px"
            alt="Component icon"
          />
          {/* </OverlayTrigger> */}
        </Nav.Link>
      </Nav.Item>
    );
  }

  function TabPaneItem({ eventKey, headerText, colorValue, components }) {
    return (
      <Tab.Pane eventKey={eventKey}>
        <div className="tab-body-header">
          <span>{headerText}</span>
          <span
            className="color-box"
            style={{ backgroundColor: colorValue }}
            onClick={showPicker}
          ></span>
        </div>
        <Accordion alwaysOpen className="component-accordion">
          {components.map((component) => (
            <Accordion.Item
              eventKey={component.visualId}
              key={component.visualId}
            >
              <Accordion.Button className="basic">
                {component.title}
              </Accordion.Button>
              <Accordion.Body>
                <Components visual={component.visualId} />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Tab.Pane>
    );
  }

  return (
    <div className="h-100 overflow-hidden">
      <div className="label">Components</div>
      <Tab.Container
        id="component-graph"
        defaultActiveKey={tabsData[0].eventKey}
      >
        <div className="tabs-container">
          <Nav variant="pills" className="flex-column icon-nav">
            {tabsData.map((tab) => (
              <TabItem
                key={tab.eventKey}
                eventKey={tab.eventKey}
                tooltip={tab.tooltip}
                iconSrc={tab.iconSrc}
              />
            ))}
          </Nav>
          <Tab.Content>
            {tabsData.map((tab) => (
              <div key={tab.eventKey}>
                <TabPaneItem
                  eventKey={tab.eventKey}
                  headerText={tab.headerText}
                  colorValue={tab.colorValue}
                  components={tab.components}
                />
              </div>
            ))}
          </Tab.Content>
        </div>
      </Tab.Container>
      <div className="photoshoppicker">
        {isPickerVisible && (
          <Draggable handle=".picker-handle">
            <div className="picker-handle">
              <PhotoshopPicker
                color={componentColor}
                onChangeComplete={handleOnChangeComplete}
                onCancel={handleCancel}
                onAccept={handleAccept}
              />
            </div>
          </Draggable>
        )}
      </div>
    </div>
  );
}
