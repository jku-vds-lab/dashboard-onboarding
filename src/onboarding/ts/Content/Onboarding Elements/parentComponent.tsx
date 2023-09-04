import React, { useState, useEffect } from "react";
import Card from "./popUpCard";
import { Report, Page, VisualDescriptor } from "powerbi-client";
import { StyleProps } from "./style";
type ParentComponentProps = {
  report: Report;
};

export default function ParentComponent(props: ParentComponentProps) {
  const [activePage, setActivePage] = useState<Page | null>(null);
  const [visuals, setVisuals] = useState<VisualDescriptor[]>([]);
  const [targetVisual, setTargetVisual] = useState<VisualDescriptor | null>(
    null
  );

  const [margin, setMargin] = useState<StyleProps>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    debugger;
    async function getDetails() {
      const pages = await props.report.getPages();
      const active = pages.find((p) => p.isActive);
      debugger;

      if (active) {
        setActivePage(active);
        const visuals = await active.getVisuals();
        setVisuals(visuals);
        let target = null;
        if (visuals) {
          target = visuals.find((v) => v.type === "lineChart");
        }

        if (target) {
          setTargetVisual(target);
          if (target) {
            console.log("Target", target);

            setMargin({
              top: target.layout.x ?? 0,
              left: target.layout.y ?? 0,
              width: target.layout.width ?? 0,
              height: target.layout.height ?? 0,
            });
          }
        }
      }
    }
    getDetails();
  }, [props.report, margin]);
  return (
    <div>
      {targetVisual && (
        <Card
          id={targetVisual!.name ?? ""}
          categories={[]}
          count={1}
          margin={margin}
          classes="class"
          role="Hi"
          label="Hi"
          clickable={true}
          parentId="onboarding"
          content="This is a card."
        />
      )}

      {/* More components or content */}
    </div>
  );
}
