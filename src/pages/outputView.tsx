import MyReport from "./report";

export default function OutputView() {
  return (
    <div id="reportContainer">
      <MyReport isMainPage={false} />
    </div>
  );
}
