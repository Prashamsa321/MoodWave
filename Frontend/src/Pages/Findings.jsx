import { useEffect, useMemo, useState } from "react";
import { Box } from "retro-react";
import ReportFileMenu from "../components/ReportFileMenu";
import RetroWindow from "../components/RetroWindow";
import { REPORTS, REPORT_BY_ID } from "../data/reportData";

export default function Findings() {
  const [selectedReportId, setSelectedReportId] = useState(null);

  // A desktop application should own its own scrolling. While the report app
  // is open, prevent the browser page itself from becoming a second scroller.
  useEffect(() => {
    document.body.classList.add("report-route-active");
    return () => document.body.classList.remove("report-route-active");
  }, []);

  const selectedReport = useMemo(
    () => (selectedReportId ? REPORT_BY_ID[selectedReportId] : null),
    [selectedReportId],
  );

  const statusText = selectedReport
    ? `${selectedReport.menuLabel} | ${selectedReport.figures.length} figure${
        selectedReport.figures.length === 1 ? "" : "s"
      }`
    : "Ready";

  return (
    <RetroWindow
      title="MoodWave Reports - Microsoft Word"
      appIcon="W"
      windowClassName="report-app-window"
      statusText={statusText}
      menuBar={
        <ReportFileMenu
          reports={REPORTS}
          activeId={selectedReportId}
          onSelect={setSelectedReportId}
        />
      }
    >
      <div className="report-editor-shell">
        <div className="report-ruler" aria-hidden="true">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
          <span>7</span>
        </div>

        <div className="report-workspace">
          <Box
            className={`report-paper ${selectedReport ? "has-report" : "is-empty"}`}
            sx={{ backgroundColor: "#ffffff" }}
          >
            {selectedReport && <ReportDocument report={selectedReport} />}
          </Box>
        </div>
      </div>
    </RetroWindow>
  );
}

function ReportDocument({ report }) {
  return (
    <article className="report-document">
      <header className="report-document-header">
        <h1>{report.title}</h1>
        <p className="report-document-subtitle">{report.subtitle}</p>
      </header>

      <section className="report-document-section">
        <h2>Summary</h2>
        <p>{report.summary}</p>
      </section>

      {report.figures.map((figure, index) => (
        <section className="report-figure-section" key={figure.src}>
          <h2>
            {index + 1}. {figure.title}
          </h2>

          <figure>
            <div className="report-image-frame">
              <img src={figure.src} alt={figure.alt} loading="lazy" />
            </div>
            <figcaption>
              Figure {index + 1}. {figure.title}
            </figcaption>
          </figure>

          <h3>Finding</h3>
          <p>{figure.finding}</p>
        </section>
      ))}
    </article>
  );
}
