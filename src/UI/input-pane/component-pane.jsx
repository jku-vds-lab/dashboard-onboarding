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
export default function ComponentPane() {
    const tabsData = [
        { eventKey: 'first', tooltip: 'Dashboard', iconSrc: c_icon, className: 'dashboard', headerText: 'Dashboard' },
        { eventKey: 'second', tooltip: 'Filters', iconSrc: c_icon_2, className: 'filters', headerText: 'Filters' },
        { eventKey: 'third', tooltip: 'KPIs', iconSrc: c_icon_3, className: 'kpi', headerText: 'KPI' },
        { eventKey: 'fourth', tooltip: 'Column chart', iconSrc: c_icon_4, className: 'column-chart', headerText: 'Column chart' },
        { eventKey: 'fifth', tooltip: 'Line chart', iconSrc: c_icon_5, className: 'line-chart', headerText: 'Line chart' },
        { eventKey: 'sixth', tooltip: 'Bar chart', iconSrc: c_icon_6, className: 'bar-chart', headerText: 'Bar chart' },
    ];
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
            <Tab.Pane eventKey={eventKey} className={className}>
                <div className="tab-body-header"><span>{headerText}</span><span className="color-box"></span></div>
            </Tab.Pane>
        )
    }
  return (
    /*<Accordion defaultActiveKey={["0"]} alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Button className="basic">Components</Accordion.Button>
        <Accordion.Body>
          <Components />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>*/
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
                          <TabPaneItem
                              key={tab.eventKey}
                              eventKey={tab.eventKey}
                              className={tab.className}
                              headerText={tab.headerText}
                          />
                      )}
                  </Tab.Content>
              </div>
          </Tab.Container>

      </div>
  );
}
