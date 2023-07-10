import Components from "./component-properties";
import React, {useState, useEffect} from 'react';
import {PhotoshopPicker} from 'react-color';
import {Nav, Tab, OverlayTrigger, Tooltip} from 'react-bootstrap';

import "../assets/css/dashboard.scss";
import icon from "../nodes-canvas/icon-1.svg";
import c_icon from "../assets/img/icon-1.png";
import c_icon_2 from "../assets/img/icon-6.png";
import c_icon_3 from "../assets/img/icon-5.png";
import c_icon_4 from "../assets/img/icon-3.png";
import c_icon_5 from "../assets/img/icon-2.png";
import c_icon_6 from "../assets/img/icon-4.png";
import {allVisuals} from "../../onboarding/ts/globalVariables";


export default function ComponentPane() {
    const [tabsData, setTabsData] = useState([{
        eventKey: 'dashboard',
        tooltip: 'Dashboard',
        iconSrc: c_icon,
        className: 'dashboard',
        headerText: 'Dashboard',
        colorVariable: '--dashboard-color',
        colorValue: '#4e91e9'
    },
        {
            eventKey: 'globalFilters',
            tooltip: 'Global Filters',
            iconSrc: c_icon_2,
            className: 'globalFilters',
            headerText: 'Global Filters',
            colorVariable: '--filters-color',
            colorValue: '#e7298a'
        }]);

    /*let tab =  { eventKey: 'dashboard', tooltip: 'Dashboard', iconSrc: c_icon, className: 'dashboard', headerText: 'Dashboard',  colorVariable: '--dashboard-color', colorValue: '#4e91e9' };
    tabsData.push(tab);*/

    for (let i = 0; i < allVisuals.length; i++) {
        const tab = {};
        let visData = getVisData(allVisuals[i]);
        tab.eventKey = allVisuals[i].name;
        tab.tooltip = visData[0];
        tab.iconSrc = visData[2];
        tab.className = visData[1];
        tab.headerText = visData[0] + " " + allVisuals[i].title;
        tab.colorVariable = '--' + allVisuals[i].name + '-color';
        tab.colorValue = '#4e91e9';
        tabsData[i + 1] = tab;
    }

    /*let tab = { eventKey: 'globalFilters', tooltip: 'Global Filters', iconSrc: c_icon_2, className: 'globalFilters', headerText: 'Global Filters', colorVariable: '--filters-color', colorValue: '#e7298a' };
    tabsData.push(tab);*/

    const [selectedTab, setSelectedTab] = useState('dashboard');
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [componentColor, setComponentColor] = useState(tabsData.find(tab => tab.eventKey === selectedTab).colorValue);

    useEffect(() => {
        const root = document.documentElement;
        tabsData.forEach(tab => {
            root.style.setProperty(tab.colorVariable, tab.colorValue);
        });
    }, []);


    useEffect(() => {
        const root = document.documentElement;
        const selectedColorVariable = tabsData.find(tab => tab.eventKey === selectedTab).colorVariable;
        root.style.setProperty(selectedColorVariable, componentColor);
    }, [selectedTab, componentColor]);
    const handleClick = (eventKey) => {
        setSelectedTab(eventKey);
        const selectedColor = tabsData.find(tab => tab.eventKey === selectedTab).colorValue;
        setComponentColor(selectedColor);
        setPickerVisible(true);
    };

    const handleAccept = (color) => {
        const selectedColorVariable = tabsData.find(tab => tab.eventKey === selectedTab).colorVariable;
        console.log(selectedTab);
        const updatedTabsData = tabsData.map(tab => {
            if (tab.eventKey === selectedTab) {
                return {
                    ...tab,
                    colorValue: componentColor
                };
            }
            return tab;
        });


        setTabsData(updatedTabsData);
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
        const VisualType = visual.type;
        switch (VisualType) {
            case 'card':
            case "multiRowCard":
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

    function TabItem({eventKey, tooltip, iconSrc}) {
        return (
            <Nav.Item>
                <Nav.Link eventKey={eventKey}>
                    <OverlayTrigger trigger="hover" placement="right" overlay={
                        <Tooltip>
                            {tooltip}
                        </Tooltip>
                    }>
                        <img className="icon options"
                             src={iconSrc}
                             width="18px"
                             height="18px" alt="Component icon"/>
                    </OverlayTrigger>
                </Nav.Link>
            </Nav.Item>
        )
    }

    function TabPaneItem({eventKey, className, headerText, colorValue}) {
        return (
            <Tab.Pane eventKey={eventKey}>
                <div className="tab-body-header"><span>{headerText}</span>
                    <span className="color-box" style={{backgroundColor: colorValue}}
                          onClick={() => handleClick(eventKey)}></span>
                </div>
                <Components visual={eventKey}/>
            </Tab.Pane>
        )
    }

    return (
        <div className="h-100">
            <div className="label">Components</div>
            <Tab.Container id="component-graph" defaultActiveKey={tabsData[0].eventKey}>
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
                            <div key={tab.eventKey}>
                                <TabPaneItem
                                    eventKey={tab.eventKey}
                                    className={tab.className}
                                    headerText={tab.headerText}
                                    colorValue={tab.colorValue}
                                />
                            </div>
                        )}
                    </Tab.Content>

                </div>
            </Tab.Container>
            <div className="photoshoppicker">
                {isPickerVisible && (
                    <PhotoshopPicker
                        color={componentColor}
                        onChangeComplete={handleOnChangeComplete}
                        onCancel={handleCancel}
                        onAccept={(color) => handleAccept(color)}
                    />
                )}
            </div>
        </div>
    );
}
